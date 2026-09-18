import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, ChevronDown, Eye } from "lucide-react";
import { ProgressMark } from "@/components/progress-mark";
import { recordTransfer } from "@/lib/wallet";
import ipnLogo from "@/assets/ipn-color.png";

type PinSearch = {
  flow?: "transfer";
  amount?: string;
  phone?: string;
};

export const Route = createFileRoute("/pin")({
  validateSearch: (search: Record<string, unknown>): PinSearch => {
    const amount = typeof search["amount"] === "string" || typeof search["amount"] === "number" ? String(search["amount"]) : undefined;
    const phone = typeof search["phone"] === "string" || typeof search["phone"] === "number" ? String(search["phone"]) : undefined;
    return {
      ...(search["flow"] === "transfer" ? { flow: "transfer" as const } : {}),
      ...(amount ? { amount } : {}),
      ...(phone ? { phone } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: "الرقم السري IPN | Instapay" },
      {
        name: "description",
        content: "أدخل الرقم السري IPN للاستعلام عن رصيد حسابك في Instapay.",
      },
      { property: "og:title", content: "الرقم السري IPN | Instapay" },
      {
        property: "og:description",
        content: "أدخل الرقم السري IPN للاستعلام عن رصيد حسابك في Instapay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PinPage,
});

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "<", "0", "ENTER"];

function PinPage() {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const search = Route.useSearch();
  const isTransfer = search.flow === "transfer";
  const amount = search.amount ?? "2000";
  const phone = search.phone ?? "01030335696";

  const press = async (key: string) => {
    if (isLoading) return;
    if (key === "<") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === "ENTER") {
      if (pin === "200200") {
        setIsLoading(true);
        if (isTransfer) {
          const numericAmount = Number(amount.replaceAll(",", "")) || 0;
          recordTransfer({
            amount: numericAmount,
            fee: Math.max(0.5, numericAmount * 0.001),
            phone,
          });
          void router.preloadRoute({
            to: "/success-simulator",
            search: { amount, phone },
          });
        }
        await new Promise((resolve) => window.setTimeout(resolve, 2500));
        if (isTransfer) {
          navigate({ to: "/success-simulator", search: { amount, phone } });
        } else {
          sessionStorage.setItem("pendingBalance", "1");
          navigate({ to: "/home" });
        }
      }
      return;
    }
    setPin((p) => (p.length >= 6 ? p : p + key));
  };

  return (
    <>
    <div className={`pin${isTransfer ? " pin-enter-transfer" : ""}`} dir="rtl" lang="ar">
      <header className="pin-header">
        <img className="pin-ipn" src={ipnLogo} alt="IPN" />
        <button type="button" className="pin-bank" dir="ltr" onClick={() => navigate({ to: "/home" })}>
          <span>National Bank of Egypt</span>
          <ChevronRight strokeWidth={2.4} />
        </button>
      </header>

      <div className="pin-account">
        <div className="pin-account-side">
          <small>معلومات عن الحساب</small>
          <strong dir="ltr">****7289</strong>
          <span>PREPAID</span>
        </div>
        <div className="pin-account-total">
          <small>المبلغ الإجمالي</small>
          <strong dir="ltr">{isTransfer ? `${(Number(amount.replaceAll(",", "")) + Math.max(0.5, Number(amount.replaceAll(",", "")) * 0.001)).toLocaleString("en-US")} EGP` : "0.5 EGP"}</strong>
        </div>
        <ChevronDown className="pin-account-chevron" strokeWidth={2.4} />
      </div>

      <div className="pin-body">
        <div className="pin-label">
          <h1>
            أدخل الرقم السري <span dir="ltr">IPN PIN</span>
          </h1>
          <button
            type="button"
            className="pin-eye"
            aria-pressed={showPin}
            onClick={() => setShowPin((s) => !s)}
          >
            <Eye strokeWidth={1.8} />
          </button>
        </div>

        <div className="pin-boxes" dir="ltr">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`pin-box${i === Math.min(pin.length, 5) ? " active" : ""}`}
            >
              {pin[i] ? (
                showPin ? (
                  <span className="pin-digit">{pin[i]}</span>
                ) : (
                  <span className="pin-dot" />
                )
              ) : (
                ""
              )}
            </div>
          ))}
        </div>

        <div className="pin-fees">
          <span>{isTransfer ? "رسوم التحويل" : "رسوم الاستعلام عن الرصيد"}</span>
          <span dir="ltr">{isTransfer ? `${Math.max(0.5, Number(amount.replaceAll(",", "")) * 0.001).toLocaleString("en-US")} EGP` : "0.5 EGP"}</span>
        </div>
      </div>

      <div className="pin-keypad" dir="ltr">
        {keys.map((key) => (
          <button
            type="button"
            key={key}
            className={`pin-key${key === "ENTER" ? " enter" : ""}`}
            onClick={() => press(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
    {isLoading && (
      <div className="pin-loading" role="status" aria-label="جارٍ التحميل">
        <ProgressMark size={88} />
      </div>
    )}
    </>
  );
}
