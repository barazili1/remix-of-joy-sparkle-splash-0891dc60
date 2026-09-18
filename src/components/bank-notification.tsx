import { useEffect, useState } from "react";
import { User } from "lucide-react";
import {
  dismissBankNotification,
  getBankNotification,
  subscribeBankNotification,
} from "@/lib/bank-notification";

const AUTO_DISMISS_MS = 5000;

export function BankNotification() {
  const [, force] = useState(0);
  const payload = getBankNotification();
  const visible = payload !== null;

  useEffect(() => subscribeBankNotification(() => force((n) => n + 1)), []);

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
            <User strokeWidth={2.2} />
            <span className="bank-notification-badge" aria-hidden="true" />
          </div>
          <div className="bank-notification-body">
            <div className="bank-notification-head">
              <strong>BanK-AlAhly</strong>
              <span>الآن</span>
            </div>
            <p>
              تم تنفيذ تحويل لحظي من بطاقتكم مسبقة الدفع بمبلغ{" "}
              <span dir="ltr">{payload.amount}</span> جنيه إلى ايمان ا*** م***
              س*** رقم...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
