"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger, ScrollSmoother);

export function SmoothScroll() {
  useGSAP((_, contextSafe) => {
    if (!contextSafe) return;

    let tween: gsap.core.Tween | undefined;
    let smoother: ScrollSmoother | undefined;
    let focusingAnchor = false;

    function focus(target: HTMLElement) {
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      focusingAnchor = true;
      target.focus({ preventScroll: true });
      focusingAnchor = false;
    }

    const media = gsap.matchMedia();
    media.add("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const scroller = ScrollSmoother.create({
        smooth: .65,
        onFocusIn: () => !focusingAnchor,
      });
      smoother = scroller;

      return () => {
        smoother = undefined;
        scroller.kill();
      };
    });

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

      if (smoother) {
        smoother.scrollTo(destination, true, `top ${offsetY}px`);
        focus(destination);
        return;
      }

      tween = gsap.to(window, {
        scrollTo: { y: destination, offsetY, autoKill: true },
        duration: .85,
        ease: "power2.inOut",
        onComplete: () => focus(destination),
      });
    });

    const cancel = () => tween?.kill();
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", cancel);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", cancel);
      media.revert();
    };
  });

  return null;
}
