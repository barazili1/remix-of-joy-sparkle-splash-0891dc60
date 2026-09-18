import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ChevronDown } from "lucide-react";
import ipnLogo from "@/assets/ipn-color.png";
import { formatMoney, useWallet } from "@/lib/wallet";

export const Route = createFileRoute("/balance")({
  head: () => ({
    meta: [
      { title: "رصيد الحساب | Instapay" },
      {
        name: "description",
        content: "استعلام عن رصيد حسابك المتاح في Instapay.",
      },
      { property: "og:title", content: "رصيد الحساب | Instapay" },
      {
        property: "og:description",
        content: "استعلام عن رصيد حسابك المتاح في Instapay.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BalancePage,
});

function BalancePage() {
  const navigate = useNavigate();
  const { balance } = useWallet();


  return (
    <div className="pin balance" dir="rtl" lang="ar">
      <header className="pin-header">
        <img className="pin-ipn" src={ipnLogo} alt="IPN" />
        <button
          type="button"
          className="pin-bank"
          dir="ltr"
          onClick={() => navigate({ to: "/home" })}
        >
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
        <ChevronDown className="pin-account-chevron" strokeWidth={2.4} />
      </div>

      <div className="balance-body">
        <p className="balance-label">رصيد حسابك المتاح هو</p>
        <p className="balance-amount" dir="ltr">{formatMoney(balance)} EGP</p>
      </div>

      <button
        type="button"
        className="balance-back"
        onClick={() => navigate({ to: "/home" })}
      >
        رجوع
      </button>
    </div>
  );
}
