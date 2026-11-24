"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(useGSAP, ScrollToPlugin);

export function SmoothScroll() {
  useGSAP((_, contextSafe) => {
    if (!contextSafe) return;

    let tween: gsap.core.Tween | undefined;

    const onClick = contextSafe((event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.target || link.hasAttribute("download") || link.classList.contains("skip-link")) return;

      const hash = link.hash;
      const destination = document.getElementById(hash.slice(1));
      if (!destination) return;

      event.preventDefault();
      tween?.kill();
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
      const offsetY = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

      tween = gsap.to(window, {
        scrollTo: { y: destination, offsetY, autoKill: true },
        duration: .85,
        ease: "power2.inOut",
        onComplete: () => {
          if (!destination.hasAttribute("tabindex")) destination.tabIndex = -1;
          destination.focus({ preventScroll: true });
        },
      });
    });

    const cancel = () => tween?.kill();
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", cancel);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", cancel);
    };
  });

  return null;
}
