type BankNotificationPayload = { amount: string };

let payload: BankNotificationPayload | null = null;
let scheduledTimer: number | undefined;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function scheduleBankNotification(next: BankNotificationPayload, delayMs: number) {
  if (scheduledTimer !== undefined) window.clearTimeout(scheduledTimer);
  scheduledTimer = window.setTimeout(() => {
    scheduledTimer = undefined;
    showBankNotification(next);
  }, delayMs);
}

export function showBankNotification(next: BankNotificationPayload) {
  payload = next;
  notify();
}

export function dismissBankNotification() {
  payload = null;
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
