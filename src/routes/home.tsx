import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProgressMark } from "@/components/progress-mark";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  Smartphone,
  X,
} from "lucide-react";
import qrCode from "@/assets/qr-code.png";
import btnQr from "@/assets/btn-qr.png";
import btnShare from "@/assets/btn-share.png";
import homeHeader from "@/assets/home-header-clean.png";
import bankLogo from "@/assets/nbe-logo.png";
import ipnLogo from "@/assets/ipn-logo.png";
import actionBalance from "@/assets/action-balance.png";
import actionLink from "@/assets/action-link.png";
import actionQr from "@/assets/action-qr.png";
import serviceBills from "@/assets/service-bills.png";
import serviceRequest from "@/assets/service-request.png";
import serviceSend from "@/assets/service-send.png";
import serviceHistory from "@/assets/service-history.png";
import serviceAccounts from "@/assets/service-accounts.png";
import serviceDonations from "@/assets/service-donations.png";
import { formatMoney, useWallet } from "@/lib/wallet";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "الرئيسية | Instapay" },
      {
        name: "description",
        content: "الصفحة الرئيسية لتطبيق Instapay: الحسابات، الخدمات، والمعاملات.",
      },
      { property: "og:title", content: "الرئيسية | Instapay" },
      {
        property: "og:description",
        content: "الصفحة الرئيسية لتطبيق Instapay: الحسابات، الخدمات، والمعاملات.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const services = [
  { label: "ارسال نقود", image: serviceSend },
  { label: "طلب دفع", image: serviceRequest },
  { label: "دفع فواتير", image: serviceBills },
  { label: "التبرعات", image: serviceDonations },
  { label: "عرض الحسابات", image: serviceAccounts },
  { label: "المعاملات السابقة", image: serviceHistory },
];


function HomePage() {
  const [qrOpen, setQrOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const navigate = useNavigate();
  const { transactions } = useWallet();


  useEffect(() => {
    if (sessionStorage.getItem("pendingBalance") !== "1") return;
    setBalanceLoading(true);
    const t = window.setTimeout(() => {
      sessionStorage.removeItem("pendingBalance");
      navigate({ to: "/balance" });
    }, 2500);
    return () => window.clearTimeout(t);
  }, [navigate]);

  useEffect(() => {
    if (!loading) return;
    const t = window.setTimeout(() => navigate({ to: "/pin" }), 1600);
    return () => window.clearTimeout(t);
  }, [loading, navigate]);
  return (
    <div className="home" dir="rtl" lang="ar">
      <div className="home-hero-wrap">
        <img
          className="home-hero"
          src={homeHeader}
          alt="مساء الخير — ادفع فواتيرك"
          width={1200}
          height={896}
        />
        <div className="home-hero-greet">
          <strong>Kareem</strong>
        </div>
        <span className="home-hero-badge" aria-label="20 إشعار جديد">
          20
        </span>
      </div>

      <section className="home-section">
        <div className="account-card">
          <div className="account-top">
            <img src={bankLogo} alt="البنك الأهلي المصري" width={125} height={125} />
            <div className="account-id">
              <p>kareem.gmal7819@instapay</p>
              <small>
                PREPAID <span>****7289</span>
              </small>
            </div>
          </div>
          <div className="account-actions">
            <button type="button" onClick={() => setQrOpen(true)}>
              <img src={actionQr} alt="" />
              <span>مشاركة QR</span>
            </button>
            <button type="button">
              <img src={actionLink} alt="" />
              <span>رابط</span>
            </button>
            <button type="button" onClick={() => setLoading(true)}>
              <img src={actionBalance} alt="" />
              <span>الرصيد</span>
            </button>
          </div>
        </div>
        <span className="dot" aria-hidden="true" />
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>الخدمات</h2>
          <button type="button">المزيد</button>
        </div>
        <div className="services-grid">
          {services.map(({ label, image }) => (
            <button
              type="button"
              className="service-tile"
              key={label}
              onClick={() => {
                if (label === "ارسال نقود") navigate({ to: "/transfersimulator", search: {} });
              }}
            >
              <img className="service-icon" src={image} alt="" />
              <p>{label}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>المعاملات</h2>
          <button type="button">المزيد</button>
        </div>
        {transactions.length === 0 && <p className="tx-empty">لا توجد معاملات بعد</p>}
        <ul className="tx-list">
          {transactions.map((tx) => (
            <li className="tx-row" key={tx.id}>
              <div className="tx-head">
                <strong dir="ltr">{formatMoney(tx.amount)} EGP</strong>
                <div className="tx-status">
                  <span className="tx-badge">ناجحة</span>
                  <span className="tx-chevron" aria-hidden="true">
                    ‹
                  </span>
                </div>
              </div>
              <div className="tx-body">
                <div className="tx-avatar">
                  {tx.out ? <Smartphone strokeWidth={1.8} /> : <span>@</span>}
                  <span className={`tx-dir ${tx.out ? "out" : "in"}`}>
                    {tx.out ? (
                      <ArrowUpLeft strokeWidth={2.6} />
                    ) : (
                      <ArrowDownRight strokeWidth={2.6} />
                    )}
                  </span>
                  <small>{tx.kind}</small>
                </div>
                <div className="tx-info">
                  <small dir="ltr">{tx.sub}</small>
                  <p>{tx.name}</p>
                  <time dir="ltr">{tx.date}</time>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="powered">
          <small>POWERED BY</small>
          <span
            className="ipn-mark"
            role="img"
            aria-label="IPN"
            style={{ maskImage: `url(${ipnLogo})`, WebkitMaskImage: `url(${ipnLogo})` }}
          />
        </div>
      </section>

      {(loading || balanceLoading) && (
        <div className="loading-overlay" role="status" aria-label="جارٍ التحميل">
          <ProgressMark size={90} />
        </div>
      )}

      {qrOpen && (
        <div className="qr-overlay" role="dialog" aria-modal="true" aria-label="مشاركة QR">
          <div className="qr-card">
            <img className="qr-image" src={qrCode} alt="رمز QR" />
            <p className="qr-handle" dir="ltr">
              kareem.gmal7819@instapay
            </p>
            <div className="qr-actions">
              <button type="button">
                <img src={btnQr} alt="" />
                <span>مشاركة QR</span>
              </button>
              <button type="button">
                <img src={btnShare} alt="" />
                <span>مشاركة الرابط</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            className="qr-close"
            aria-label="إغلاق"
            onClick={() => setQrOpen(false)}
          >
            <X strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
