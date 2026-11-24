"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const particles = [
  [3, 19, 5, 0.8], [8, 13, 3, -0.6], [13, 31, 8, 0.4],
  [5, 50, 3, 0.55], [10, 66, 6, -0.85], [2.5, 78, 4, 0.65],
  [16, 83, 3, 0.4], [87, 10, 4, 0.65], [95, 22, 7, -0.65],
  [91, 36, 3, 0.5], [97, 49, 4, 0.75], [86, 60, 5, -0.45],
  [94, 74, 3, 0.85], [89, 86, 8, -0.7], [97, 92, 3, 0.4],
] as const;

export function SectionParticles() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const section = layer?.parentElement;
    if (!layer || !section) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    function paint() {
      frame = 0;
      if (!layer || !section || motion.matches) return;
      const bounds = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
      layer.style.setProperty("--particle-scroll", `${(progress - 0.5) * 104}px`);
      layer.style.setProperty("--particle-x", `${pointerX}px`);
      layer.style.setProperty("--particle-y", `${pointerY}px`);
    }

    function schedule() {
      if (visible && !frame && !motion.matches) frame = window.requestAnimationFrame(paint);
    }

    function move(event: PointerEvent) {
      if (event.pointerType === "touch" || !section || motion.matches) return;
      const bounds = section.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left - bounds.width / 2) * 38 / bounds.width;
      pointerY = (event.clientY - bounds.top - bounds.height / 2) * 28 / bounds.height;
      schedule();
    }

    function resetPointer() {
      pointerX = 0;
      pointerY = 0;
      schedule();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", resetPointer);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", resetPointer);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", resetPointer);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <div ref={layerRef} className="section-particles" aria-hidden="true">
      {particles.map(([x, y, size, depth]) => (
        <i key={`${x}-${y}`} data-ring={size >= 6} style={{
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          "--particle-depth": depth,
        } as CSSProperties} />
      ))}
    </div>
  );
}
