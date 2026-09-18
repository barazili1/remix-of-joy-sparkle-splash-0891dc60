import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, ChevronRight, Share2, Star, Wallet } from "lucide-react";
import bankLogo from "@/assets/nbe-logo.png";
import ipnLogo from "@/assets/ipn-logo-colored.png";
import successCheck from "@/assets/success-check.jpeg";

const FEE = 0.5;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatTransactionDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const h12 = d.getHours() % 12 || 12;
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${pad(h12)}:${pad(d.getMinutes())} ${ampm}`;
}

type SuccessSearch = {
  amount?: string;
  phone?: string;
};

export const Route = createFileRoute("/success-simulator")({
  validateSearch: (search: Record<string, unknown>): SuccessSearch => {
    const amount = typeof search["amount"] === "string" || typeof search["amount"] === "number" ? String(search["amount"]) : undefined;
    const phone = typeof search["phone"] === "string" || typeof search["phone"] === "number" ? String(search["phone"]) : undefined;
    return { ...(amount ? { amount } : {}), ...(phone ? { phone } : {}) };
  },
  head: () => ({
    meta: [
      { title: "معاملة ناجحة | Instapay" },
      { name: "description", content: "تأكيد نجاح تحويل الأموال عبر Instapay." },
      { property: "og:title", content: "معاملة ناجحة | Instapay" },
      { property: "og:description", content: "تأكيد نجاح تحويل الأموال عبر Instapay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuccessSimulatorPage,
});

function SuccessSimulatorPage() {
  const navigate = useNavigate();
  const { amount: amountSearch, phone: phoneSearch } = Route.useSearch();
  const amount = Number((amountSearch ?? "2000").replaceAll(",", "")) || 2000;
  const phone = phoneSearch?.trim() || "01030335696";
  const [showDetails, setShowDetails] = useState(false);
  const [reference] = useState(() => Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join(""));
  const [transactionDate] = useState(() => formatTransactionDate(new Date()));

  return (
    <main className="success-simulator" dir="rtl" lang="ar">
      <header className="success-header">
        <h1>معاملة ناجحة</h1>
        <button type="button" aria-label="رجوع" onClick={() => navigate({ to: "/home" })}>
          <ChevronRight strokeWidth={2.6} />
        </button>
      </header>

      <img className="success-visual" src={successCheck} alt="تم التحويل بنجاح" />
      <p className="success-message">تم التحويل بنجاح</p>
      <section className="success-amount" aria-label="مبلغ التحويل">
        <strong dir="ltr"><b>{amount.toLocaleString("en-US")}</b> <span>EGP</span></strong>
        <small>مبلغ التحويل</small>
      </section>

      <section className="success-receipt" aria-label="بيانات التحويل">
        <article className="success-party success-from">
          <img src={bankLogo} alt="البنك الأهلي المصري" />
          <div>
            <span>من</span>
            <p dir="ltr">mohamed.othman4279@instapay</p>
            <small dir="ltr">CARD&nbsp; ****7289</small>
          </div>
        </article>
        <span className="success-divider-check" aria-hidden="true"><Check /></span>
        <article className="success-party success-to">
          <span className="success-wallet" aria-hidden="true"><Wallet strokeWidth={2.6} /></span>
          <div>
            <p><span>إلى</span> المحفظه الالكترونية</p>
            <small dir="ltr">Eman A S****</small>
            <strong dir="ltr">{phone}</strong>
          </div>
          <Star className="success-star" strokeWidth={2.1} />
        </article>
      </section>

      <button
        type="button"
        className={`success-more${showDetails ? " open" : ""}`}
        aria-expanded={showDetails}
        onClick={() => setShowDetails((v) => !v)}
      >
        <span>{showDetails ? "إخفاء التفاصيل" : "المزيد من التفاصيل"}</span>
        <ChevronDown />
      </button>

      {showDetails && (
        <section className="success-details" aria-label="تفاصيل المعاملة">
          <article className="success-detail-card">
            <div className="success-detail-row">
              <span className="success-detail-label">رسوم الخدمة</span>
              <span className="success-detail-value" dir="ltr">{FEE.toFixed(1)} EGP</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">المبلغ الإجمالي</span>
              <span className="success-detail-value" dir="ltr">{(amount + FEE).toFixed(1)} EGP</span>
            </div>
          </article>
          <article className="success-detail-card">
            <div className="success-detail-row">
              <span className="success-detail-label">الرقم المرجعي</span>
              <span className="success-detail-value" dir="ltr">{reference}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">التاريخ</span>
              <span className="success-detail-value" dir="ltr">{transactionDate}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">ملاحظة</span>
              <span className="success-detail-value">مصارف المعيشة</span>
            </div>
          </article>
        </section>
      )}

      <img className="success-ipn" src={ipnLogo} alt="Powered by IPN" />

      <footer className="success-actions">
        <button type="button" className="success-home" onClick={() => navigate({ to: "/home" })}>الرئيسية</button>
        <button
          type="button"
          className="success-share"
          aria-label="مشاركة"
          onClick={() => {
            if (navigator.share) void navigator.share({ title: "معاملة ناجحة", text: `تم تحويل ${amount.toLocaleString("en-US")} EGP بنجاح` });
          }}
        >
          <Share2 />
        </button>
      </footer>
    </main>
  );
}