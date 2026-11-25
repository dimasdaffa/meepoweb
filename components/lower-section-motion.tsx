"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function LowerSectionMotion() {
  useGSAP(() => {
    const page = document.getElementById("smooth-content");
    if (!page) return;

    const media = gsap.matchMedia(page);
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 768px)",
    }, ({ conditions }) => {
      if (!conditions?.motion) return;

      const desktop = conditions.desktop;
      const select = gsap.utils.selector(page);
      const features = select(".feature-grid > .feature");

      if (desktop) {
        gsap.from(features, {
          x: -24, y: 22, opacity: 0, duration: .55, stagger: .32, ease: "power1.out",
          scrollTrigger: { trigger: ".feature-grid", start: "top 91%", end: "top 43%", scrub: .25 },
        });
      } else {
        for (const feature of features) {
          gsap.from(feature, {
            y: 16, opacity: 0, ease: "power1.out",
            scrollTrigger: { trigger: feature, start: "top 94%", end: "top 68%", scrub: .2 },
          });
        }
      }

      for (const layer of select(".section-particles")) {
        const drift = desktop ? 86 : 36;
        gsap.fromTo(layer, { "--particle-scroll": `${-drift}px` }, {
          "--particle-scroll": `${drift}px`,
          ease: "none",
          scrollTrigger: { trigger: layer.parentElement, start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: .45 },
        });
      }

      const subjects = [
        { target: ".relay-map", property: "--relay-grid-offset", trigger: ".relay-console", distance: desktop ? 56 : 24 },
        { target: ".faq-range", property: "y", trigger: ".faq-grid", distance: desktop ? 24 : 10 },
        { target: ".app-download-qr img", property: "y", trigger: ".app-download", distance: desktop ? 14 : 6 },
      ];
      for (const { target, property, trigger, distance } of subjects) {
        gsap.fromTo(target, { [property]: -distance / 2 }, {
          [property]: distance / 2,
          ease: "none",
          scrollTrigger: { trigger, start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: .45 },
        });
      }

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: ".lora-diagram", start: "top 94%", end: "top 30%", scrub: .35 },
      })
        .from(".lora-link-reveal", { strokeDashoffset: 100 }, 0)
        .from(".lora-coverage", { scale: .8, opacity: .55, transformOrigin: "center" }, 0);
    });

    return () => media.revert();
  });

  return null;
}
