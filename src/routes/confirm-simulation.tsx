import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronUp, Info, Wallet } from "lucide-react";
import { ProgressMark } from "@/components/progress-mark";
import bankLogo from "@/assets/nbe-logo.png";
import ipnLogo from "@/assets/ipn-logo.png";

type ConfirmSearch = {
  amount?: string;
  phone?: string;
};

function stringSearchValue(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}

export const Route = createFileRoute("/confirm-simulation")({
  validateSearch: (search: Record<string, unknown>): ConfirmSearch => {
    const amount = stringSearchValue(search["amount"]);
    const phone = stringSearchValue(search["phone"]);
    return { ...(amount ? { amount } : {}), ...(phone ? { phone } : {}) };
  },
  head: () => ({
    meta: [
      { title: "تأكيد التحويل | Instapay" },
      { name: "description", content: "مراجعة وتأكيد تفاصيل تحويل الأموال عبر Instapay." },
      { property: "og:title", content: "تأكيد التحويل | Instapay" },
      {
        property: "og:description",
        content: "مراجعة وتأكيد تفاصيل تحويل الأموال عبر Instapay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConfirmSimulationPage,
});

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function ConfirmSimulationPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { amount: amountSearch, phone: phoneSearch } = Route.useSearch();
  const amount = Number((amountSearch ?? "2000").replaceAll(",", "")) || 2000;
  const phone = phoneSearch?.trim() || "01030335696";
  const fee = Math.max(0.5, amount * 0.001);
  const total = amount + fee;

  const confirmTransfer = async () => {
    if (isLoading) return;
    setIsLoading(true);
    void router.preloadRoute({
      to: "/pin",
      search: { flow: "transfer", amount: amountSearch ?? "2000", phone },
    });
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
    navigate({
      to: "/pin",
      search: { flow: "transfer", amount: amountSearch ?? "2000", phone },
    });
  };

  return (
    <>
    <main className="confirm-simulation" dir="rtl" lang="ar">
      <div className="confirm-bg" aria-hidden="true" />

      <header className="confirm-header">
        <button
          type="button"
          className="confirm-back"
          aria-label="رجوع"
          onClick={() =>
            navigate({
              to: "/transfersimulator",
              search: {
                ...(amountSearch ? { amount: amountSearch } : {}),
                ...(phoneSearch ? { phone: phoneSearch } : {}),
              },
            })
          }
        >
          <ChevronLeft strokeWidth={2.6} />
        </button>
        <h1>إرسال نقود</h1>
      </header>

      <section className="confirm-amount" aria-label="المبلغ المحول">
        <strong dir="ltr">{formatMoney(amount)} EGP</strong>
        <span>المبلغ المحول</span>
      </section>

      <section className="confirm-summary">
        <div>
          <span className="confirm-summary-label">
            رسوم الخدمة <Info strokeWidth={2.2} />
          </span>
          <span dir="ltr">{formatMoney(fee)} EGP</span>
        </div>
        <div className="confirm-summary-total">
          <strong>المبلغ الإجمالي</strong>
          <strong dir="ltr">{formatMoney(total)} EGP</strong>
        </div>
      </section>

      <section className="confirm-parties" aria-label="تفاصيل التحويل">
        <article className="confirm-party confirm-sender">
          <img src={bankLogo} alt="البنك الأهلي المصري" />
          <div>
            <span>من</span>
            <p dir="ltr">mohamed.othman4279@instapay</p>
            <small dir="ltr">CARD&nbsp; ****7289</small>
          </div>
        </article>

        <div className="confirm-transfer-mark" aria-hidden="true">
          <span />
          <div><ChevronDown /><ChevronDown /></div>
          <span />
        </div>

        <article className="confirm-party confirm-recipient">
          <span className="confirm-wallet-icon" role="img" aria-label="المحفظة الإلكترونية">
            <Wallet strokeWidth={2.7} />
          </span>
          <div>
            <p><span>إلى</span> انستاباي</p>
            <small>ايمان ا*** م*** س***</small>
            <strong dir="ltr">{phone}</strong>
          </div>
        </article>
      </section>

      <button
        type="button"
        className="confirm-details"
        aria-expanded={detailsOpen}
        onClick={() => setDetailsOpen((open) => !open)}
      >
        {detailsOpen ? <ChevronUp strokeWidth={2.4} /> : <ChevronDown strokeWidth={2.4} />}
        <span>{detailsOpen ? "إخفاء التفاصيل" : "المزيد من التفاصيل"}</span>
      </button>

      {detailsOpen && (
        <section className="confirm-extra-details" aria-label="المزيد من تفاصيل التحويل">
          <div>
            <span>غرض التحويل</span>
            <strong>مصاريف المعيشة</strong>
          </div>
          <div>
            <span>ملاحظة</span>
          </div>
        </section>
      )}

      <img className="confirm-ipn" src={ipnLogo} alt="IPN" />

      <footer className="confirm-actions">
        <button type="button" className="confirm-submit" disabled={isLoading} onClick={confirmTransfer}>تأكيد</button>
        <button
          type="button"
          className="confirm-return"
          aria-label="رجوع"
          onClick={() => navigate({ to: "/transfersimulator", search: {} })}
        >
          <ArrowRight strokeWidth={2.5} />
        </button>
      </footer>
    </main>
    {isLoading && (
      <div className="ts-loading" role="status" aria-label="جارٍ التحميل">
        <ProgressMark size={88} />
      </div>
    )}
    </>
  );
}