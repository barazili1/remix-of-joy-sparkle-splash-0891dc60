type BankNotificationPayload = { amount: string };

const PENDING_KEY = "bank-notification-pending";
const AUTO_DISMISS_MS = 5000;

let payload: BankNotificationPayload | null = null;
let scheduledTimer: number | undefined;
let restored = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function scheduleBankNotification(next: BankNotificationPayload, delayMs: number) {
  if (scheduledTimer !== undefined) window.clearTimeout(scheduledTimer);
  const fireAt = Date.now() + delayMs;
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ payload: next, fireAt }));
  } catch {
    /* storage unavailable */
  }
  scheduledTimer = window.setTimeout(() => {
    scheduledTimer = undefined;
    showBankNotification(next);
  }, delayMs);
}

export function restorePendingBankNotification() {
  if (restored || payload !== null || scheduledTimer !== undefined) return;
  restored = true;
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    const { payload: pending, fireAt } = JSON.parse(raw) as {
      payload: BankNotificationPayload;
      fireAt: number;
    };
    const wait = fireAt - Date.now();
    if (wait > 0) {
      scheduledTimer = window.setTimeout(() => {
        scheduledTimer = undefined;
        showBankNotification(pending);
      }, wait);
    } else if (wait > -AUTO_DISMISS_MS) {
      showBankNotification(pending);
    } else {
      window.sessionStorage.removeItem(PENDING_KEY);
    }
  } catch {
    /* corrupt or unavailable storage */
  }
}

export function showBankNotification(next: BankNotificationPayload) {
  payload = next;
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable */
  }
  notify();
}

export function dismissBankNotification() {
  payload = null;
  try {
    window.sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable */
  }
  notify();
}

export function getBankNotification() {
  return payload;
}

export function subscribeBankNotification(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
