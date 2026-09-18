import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import backgroundAsset from "@/assets/instapay-background.jpeg";
import instapayLogo from "@/assets/instapay-logo.png";
import ipnLogo from "@/assets/ipn-logo.png";
import { ProgressMark } from "@/components/progress-mark";
import { preloadAllAssets } from "@/lib/preload-assets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Instapay | Splash Screen" },
      { name: "description", content: "Instapay mobile application splash screen." },
      { property: "og:title", content: "Instapay | Splash Screen" },
      { property: "og:description", content: "Instapay mobile application splash screen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [phase, setPhase] = useState<"splash" | "progress">("splash");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const showProgress = window.setTimeout(() => setPhase("progress"), 1000);

    const minWait = new Promise<void>((resolve) =>
      window.setTimeout(resolve, 3000),
    );
    const maxWait = new Promise<void>((resolve) =>
      window.setTimeout(resolve, 9000),
    );

    Promise.all([minWait, Promise.race([preloadAllAssets(), maxWait])]).then(
      () => {
        if (!cancelled) navigate({ to: "/home" });
      },
    );

    return () => {
      cancelled = true;
      window.clearTimeout(showProgress);
    };
  }, [navigate]);

  return (
    <main
      className={`splash${phase === "progress" ? " splash--loading" : ""}`}
      aria-label="Instapay splash screen"
      style={{ backgroundImage: `url(${backgroundAsset})` }}
    >
      <section className="brand-lockup">
        <p lang="ar" dir="rtl">أهلاً بك في</p>
        <h1 className="sr-only">Instapay</h1>
        <img src={instapayLogo} alt="Instapay" />
      </section>

      {phase === "progress" && (
        <section className="progress-screen" aria-label="جارٍ التحميل">
          <ProgressMark />
        </section>
      )}

      <footer className="splash-footer">
        <img src={ipnLogo} alt="IPN" />
        <small>V1.12.1</small>
      </footer>
    </main>
  );
}
