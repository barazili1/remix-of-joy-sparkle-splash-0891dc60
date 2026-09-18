import { Link, useRouterState } from "@tanstack/react-router";
import navHome from "@/assets/nav-home.png";
import navSend from "@/assets/nav-send.png";
import navRequest from "@/assets/nav-request.png";
import navBills from "@/assets/nav-bills.png";
import navMenu from "@/assets/nav-menu.png";

const items = [
  { label: "الرئيسية", icon: navHome, to: "/home" as const },
  { label: "ارسال", icon: navSend, to: "/transfersimulator" as const },
  { label: "طلب دفع", icon: navRequest },
  { label: "الفواتير", icon: navBills },
  { label: "القائمة", icon: navMenu },
];

export function AppBottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const visible = pathname === "/home" || pathname === "/transfersimulator";

  return (
    <nav
      className={`bottom-nav${visible ? " is-visible" : ""}`}
      aria-label="التنقل"
      aria-hidden={!visible}
      dir="rtl"
      lang="ar"
    >
      {items.map((item) => {
        const active = item.to === pathname;
        const content = (
          <>
            <span
              className="nav-icon-tint"
              aria-hidden="true"
              style={{ maskImage: `url(${item.icon})`, WebkitMaskImage: `url(${item.icon})` }}
            />
            <span className="nav-label">{item.label}</span>
          </>
        );

        if (item.to) {
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`nav-item${active ? " active" : ""}`}
              aria-label={item.label}
              tabIndex={visible ? 0 : -1}
              preload="intent"
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            className="nav-item"
            aria-label={item.label}
            tabIndex={visible ? 0 : -1}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}