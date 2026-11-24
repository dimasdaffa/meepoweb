"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const nodes = [
  [0, 0.29], [0.22, 0.17], [0.42, 0.27], [0.73, 0.14], [0.97, 0.26],
  [0.68, 0.4], [0.27, 0.39], [0.08, 0.51], [0.48, 0.51], [0.9, 0.49],
  [0.15, 0.68], [0.38, 0.79], [0.05, 0.85],
] as const;

const links = [
  [0, 1], [0, 6], [1, 2], [1, 3], [2, 3], [2, 5], [2, 6],
  [3, 4], [4, 5], [4, 9], [5, 8], [5, 9], [6, 7], [6, 8],
  [7, 10], [8, 9], [8, 10], [10, 11], [10, 12], [11, 12],
] as const;

const routes = [
  { nodes: [0, 1, 2, 5, 9], duration: 7600, offset: 1000 },
  { nodes: [4, 3, 2, 6, 7, 10, 11, 12], duration: 10800, offset: 5900 },
  { nodes: [9, 5, 8, 10], duration: 6800, offset: 2000 },
] as const;

const orbitNodes = [
  [0.18, 0.26], [0.68, 0.2], [0.88, 0.38], [0.28, 0.46],
  [0.12, 0.67], [0.76, 0.65], [0.44, 0.86],
] as const;

const orbitLinks = [
  [0, 1], [0, 3], [1, 2], [1, 3], [2, 3], [2, 5],
  [3, 4], [3, 5], [4, 5], [4, 6], [5, 6],
] as const;

const orbitRoutes = [
  { nodes: [0, 1, 2, 5, 6], duration: 6900, offset: 1200 },
  { nodes: [6, 4, 3, 1], duration: 5200, offset: 3400 },
] as const;

type Signal = { cycle: number; speed: number };

export function HeroMesh({ placement = "hero" }: { placement?: "hero" | "orbit" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signals = useRef<Signal[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const surface = canvas?.parentElement?.parentElement;
    if (!canvas || !context || !surface) return;

    const inOrbit = placement === "orbit";
    const meshNodes = inOrbit ? orbitNodes : nodes;
    const meshLinks = inOrbit ? orbitLinks : links;
    const meshRoutes = inOrbit ? orbitRoutes : routes;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastDraw = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerInside = false;
    let influence = 0;
    let inView = true;

    function draw(delta = 0) {
      if (!context || width === 0 || height === 0) return;
      context.clearRect(0, 0, width, height);
      const reach = inOrbit ? 110 : 340;

      for (const mirrored of [false, true]) {
        const points = meshNodes.map(([x, y]) => {
          const inset = inOrbit ? 0.04 + x * 0.24 : x * 0.29;
          return {
            x: width * (mirrored ? 1 - inset : inset),
            y: Math.min(height, 900) * (y + (mirrored ? 0.025 : 0)),
          };
        });

        context.beginPath();
        for (const [from, to] of meshLinks) {
          context.moveTo(points[from].x, points[from].y);
          context.lineTo(points[to].x, points[to].y);
        }
        context.lineWidth = 1;
        context.strokeStyle = "rgba(83, 132, 175, 0.25)";
        context.stroke();

        context.beginPath();
        for (const { x, y } of points) {
          context.moveTo(x + 3, y);
          context.arc(x, y, 3, 0, Math.PI * 2);
        }
        context.fillStyle = "rgba(83, 132, 175, 0.42)";
        context.fill();

        if (reducedMotion.matches) continue;
        for (const [index, route] of meshRoutes.entries()) {
          const signalIndex = index + (mirrored ? meshRoutes.length : 0);
          const signal = signals.current[signalIndex] ??= {
            cycle: ((route.offset + (mirrored ? 3400 : 0)) % route.duration) / route.duration,
            speed: 1,
          };
          const { cycle } = signal;
          const progress = cycle * (route.nodes.length - 1);
          const hop = Math.floor(progress);
          const fraction = progress - hop;
          const from = points[route.nodes[hop]];
          const to = points[route.nodes[hop + 1]];
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const x = from.x + dx * fraction;
          const y = from.y + dy * fraction;
          const trail = Math.min(1, Math.max(0, fraction - 0.22 * Math.sign(signal.speed)));

          const cursorX = pointerX - x;
          const cursorY = pointerY - y;
          const proximity = Math.max(0, 1 - Math.hypot(cursorX, cursorY) / reach) * influence;
          const alongLink = (cursorX * dx + cursorY * dy) / Math.hypot(dx, dy);
          const towardCursor = Math.max(-1, Math.min(1, alongLink / 30));
          const targetSpeed = 1 + proximity * (towardCursor * 1.4 - 1);
          signal.speed += (targetSpeed - signal.speed) * Math.min(1, delta / 125);
          const nextCycle = cycle + delta * signal.speed / route.duration;
          signal.cycle = nextCycle - Math.floor(nextCycle);

          context.globalAlpha = Math.min(1, cycle * 18, (1 - cycle) * 18);
          context.beginPath();
          context.moveTo(from.x + dx * trail, from.y + dy * trail);
          context.lineTo(x, y);
          context.strokeStyle = "rgba(69, 131, 185, 0.55)";
          context.lineWidth = 2;
          context.stroke();

          context.beginPath();
          context.arc(x, y, 7, 0, Math.PI * 2);
          context.fillStyle = "rgba(86, 152, 209, 0.18)";
          context.fill();
          context.beginPath();
          context.arc(x, y, 3.5, 0, Math.PI * 2);
          context.fillStyle = "#4786bc";
          context.fill();
          context.globalAlpha = 1;
        }
      }
    }

    function tick(timestamp: number) {
      const delta = timestamp - lastDraw;
      if (delta >= 1000 / 30) {
        lastDraw = timestamp;
        pointerX += (targetX - pointerX) * 0.45;
        pointerY += (targetY - pointerY) * 0.45;
        influence += ((pointerInside ? 1 : 0) - influence) * 0.22;
        if (inView) draw(delta);
      }
      frame = window.requestAnimationFrame(tick);
    }

    function syncAnimation() {
      window.cancelAnimationFrame(frame);
      if (width === 0 || height === 0) return;
      draw();
      if (paused || reducedMotion.matches || document.hidden) return;
      lastDraw = performance.now();
      frame = window.requestAnimationFrame(tick);
    }

    function trackPointer(event: PointerEvent) {
      if (event.pointerType === "touch" || paused || reducedMotion.matches || width === 0 || height === 0 || !canvas) return;
      const bounds = canvas.getBoundingClientRect();
      targetX = event.clientX - bounds.left;
      targetY = event.clientY - bounds.top;
      if (!pointerInside) {
        pointerX = targetX;
        pointerY = targetY;
      }
      pointerInside = true;
    }

    function releasePointer() {
      pointerInside = false;
    }

    const observer = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const scale = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      syncAnimation();
    });
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    observer.observe(canvas);
    visibility.observe(canvas);
    surface.addEventListener("pointermove", trackPointer, { passive: true });
    surface.addEventListener("pointerleave", releasePointer);
    reducedMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      surface.removeEventListener("pointermove", trackPointer);
      surface.removeEventListener("pointerleave", releasePointer);
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, [paused, placement]);

  const label = paused ? "Resume mesh animation" : "Pause mesh animation";

  return (
    <div className={`hero-mesh hero-mesh--${placement}`}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <button className="hero-mesh-toggle" type="button" aria-label={label} title={label} onClick={() => setPaused((current) => !current)}>
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
      </button>
    </div>
  );
}
