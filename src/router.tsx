import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultViewTransition: {
      // Per-navigation transition types:
      // - into PIN: slides up
      // - into the transfer page: slides right (fast)
      // - back home from transfer: slides left (fast)
      // - back home from success: slides left, slightly slower
      types: ({ fromLocation, toLocation }) => {
        const to = toLocation?.pathname;
        const from = fromLocation?.pathname;
        if (to === "/pin") return ["vt-up"];
        if (to === "/transfersimulator") return ["vt-right"];
        if (to === "/" || to === "/home") {
          if (from === "/success-simulator") return ["vt-back"];
          if (from === "/") return []; // splash -> home: no slide
          return ["vt-left"];
        }
        return [];
      },
    },
  });

  return router;
};
