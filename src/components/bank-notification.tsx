import { useEffect, useState } from "react";
import { User } from "lucide-react";
import {
  dismissBankNotification,
  getBankNotification,
  restorePendingBankNotification,
  subscribeBankNotification,
} from "@/lib/bank-notification";

const AUTO_DISMISS_MS = 5000;

export function BankNotification() {
  const [, force] = useState(0);
  const payload = getBankNotification();
  const visible = payload !== null;

  useEffect(() => {
    restorePendingBankNotification();
    return subscribeBankNotification(() => force((n) => n + 1));
  }, []);

  useEffect(() => {
    if (!payload) return;
    const t = window.setTimeout(dismissBankNotification, AUTO_DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [payload]);

  return (
    <div
      className={`bank-notification${visible ? " visible" : ""}`}
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
              تم تنفيذ تحويل لحظي من بطاقتكم مسبقة الدفع بمبلغ{" "}
              <span dir="ltr">{payload.amount}</span> جم إلى ايمان ا*** م*** س***
              رقم...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
