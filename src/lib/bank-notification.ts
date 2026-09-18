type BankNotificationPayload = { amount: string };

type StoredNotification =
  | { status: "pending"; payload: BankNotificationPayload; fireAt: number }
  | { status: "visible"; payload: BankNotificationPayload; shownAt: number; expiresAt: number };

type VisibleNotification = {
  payload: BankNotificationPayload;
  shownAt: number;
  expiresAt: number;
};

const PENDING_KEY = "bank-notification-pending";
const AUTO_DISMISS_MS = 5000;

let notification: VisibleNotification | null = null;
let scheduledTimer: number | undefined;
let dismissTimer: number | undefined;
let restored = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function scheduleBankNotification(next: BankNotificationPayload, delayMs: number) {
  if (notification !== null || scheduledTimer !== undefined) return;
  const fireAt = Date.now() + delayMs;
  try {
    const stored: StoredNotification = { status: "pending", payload: next, fireAt };
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(stored));
  } catch {
    /* storage unavailable */
  }
  scheduledTimer = window.setTimeout(() => {
    scheduledTimer = undefined;
    showBankNotification(next);
  }, delayMs);
}

export function restorePendingBankNotification() {
  if (restored || notification !== null || scheduledTimer !== undefined) return;
  restored = true;
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    const stored = JSON.parse(raw) as StoredNotification;
    if (stored.status === "visible") {
      if (stored.expiresAt > Date.now()) {
        showBankNotification(stored.payload, stored.shownAt, stored.expiresAt);
      } else {
        window.sessionStorage.removeItem(PENDING_KEY);
      }
      return;
    }
    const wait = stored.fireAt - Date.now();
    if (wait > 0) {
      scheduledTimer = window.setTimeout(() => {
        scheduledTimer = undefined;
        showBankNotification(stored.payload);
      }, wait);
    } else if (wait > -AUTO_DISMISS_MS) {
      const shownAt = stored.fireAt;
      showBankNotification(stored.payload, shownAt, shownAt + AUTO_DISMISS_MS);
    } else {
      window.sessionStorage.removeItem(PENDING_KEY);
    }
  } catch {
    /* corrupt or unavailable storage */
  }
}

export function showBankNotification(
  next: BankNotificationPayload,
  shownAt = Date.now(),
  expiresAt = shownAt + AUTO_DISMISS_MS,
) {
  if (notification !== null) return;
  notification = { payload: next, shownAt, expiresAt };
  try {
    const stored: StoredNotification = { status: "visible", payload: next, shownAt, expiresAt };
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(stored));
  } catch {
    /* storage unavailable */
  }
  if (dismissTimer !== undefined) window.clearTimeout(dismissTimer);
  dismissTimer = window.setTimeout(dismissBankNotification, Math.max(0, expiresAt - Date.now()));
  notify();
}

export function dismissBankNotification() {
  notification = null;
  if (scheduledTimer !== undefined) window.clearTimeout(scheduledTimer);
  if (dismissTimer !== undefined) window.clearTimeout(dismissTimer);
  scheduledTimer = undefined;
  dismissTimer = undefined;
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable */
  }
  notify();
}

export function getBankNotification() {
  return notification;
}

export function subscribeBankNotification(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
