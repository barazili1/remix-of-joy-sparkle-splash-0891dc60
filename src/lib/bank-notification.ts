type BankNotificationPayload = { amount: string };

let payload: BankNotificationPayload | null = null;
const listeners = new Set<() => void>();

export function showBankNotification(next: BankNotificationPayload) {
  payload = next;
  listeners.forEach((listener) => listener());
}

export function dismissBankNotification() {
  payload = null;
  listeners.forEach((listener) => listener());
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
