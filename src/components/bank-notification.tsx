import { useEffect, useSyncExternalStore } from "react";
import {
  getBankNotification,
  restorePendingBankNotification,
  subscribeBankNotification,
} from "@/lib/bank-notification";

export function BankNotification() {
  const notification = useSyncExternalStore(
    subscribeBankNotification,
    getBankNotification,
    () => null,
  );
  const payload = notification?.payload;
  const visible = notification !== null;
  const entering = notification !== null && Date.now() - notification.shownAt < 900;

  useEffect(() => {
    restorePendingBankNotification();
  }, []);

  return (
    <div
      className={`bank-notification${visible ? " visible" : ""}${entering ? " entering" : ""}`}
      role="status"
      aria-live="polite"
      dir="rtl"
      lang="ar"
      aria-hidden={!visible}
    >
      {payload && (
        <div className="bank-notification-card">
          <div className="bank-notification-avatar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 13.4c-4.1 0-7.4 2.5-7.4 5.6 0 .6.5 1 1.1 1h12.6c.6 0 1.1-.4 1.1-1 0-3.1-3.3-5.6-7.4-5.6Z" />
            </svg>
            <span className="bank-notification-badge" aria-hidden="true" />
          </div>
          <div className="bank-notification-body">
            <div className="bank-notification-head">
              <strong>BanK-AlAhly</strong>
              <span>الآن</span>
            </div>
            <p>
              تم تنفيذ تحويل لحظي بمبلغ <span dir="ltr">{payload.amount}</span>{" "}
              جم إلى ايمان ا*** م*** س***
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
