"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroMesh } from "@/components/hero-mesh";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const screens = [
  { image: "/meepo-meeting-point.webp", label: "Set Meeting Point", description: "Meeting point screen with four group members on the offline map." },
  { image: "/meepo-follow.webp", label: "Follow a group member", description: "Orbit points toward SIS and shows the distance to her." },
  { image: "/meepo-orbit-happy-family.webp", label: "Orbit", description: "The Happy Family group and their positions in Orbit." },
  { image: "/meepo-sos-active.webp", label: "SOS Active", description: "The SOS sender sees who is on their way, with the End button visible." },
  { image: "/meepo-sos-received.webp", label: "Incoming SOS", description: "An emergency alert from SIS with options to dismiss it or respond." },
];
const center = Math.floor(screens.length / 2);

export function OrbitPreview() {
  const stage = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(center);
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? selected;
  const lift = hovered === null ? 4 : 16;
  const scale = hovered === null ? 1.02 : 1.065;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      allowMotion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 768px)",
    }, ({ conditions }) => {
      if (!conditions?.allowMotion || !stage.current) return;

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage.current, start: 0, end: () => Math.min(window.innerHeight * .55, 480), scrub: .4 },
      })
        .to(".stage-grid, .stage-rings", { y: conditions.desktop ? 64 : 20 }, 0)
        .to(".orbit-gallery", { y: conditions.desktop ? 18 : 6 }, 0);
    }, stage);

    return () => media.revert();
  }, { scope: stage });

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(".hero-screenshot", {
      y: (index: number) => index === active ? -lift : 0,
      scale: (index: number) => index === active ? scale : 1,
      duration: .48,
      ease: "back.out(2.1)",
      overwrite: "auto",
    });
  }, { scope: gallery, dependencies: [active, lift, scale] });

  return (
    <figure className="hero-stage" ref={stage} data-ui data-enter-media>
      <div className="stage-grid" aria-hidden="true" />
      <div className="stage-rings" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <HeroMesh placement="orbit" />
      <div className="orbit-gallery" ref={gallery} role="group" aria-label="Meepo app screenshots" onPointerLeave={() => setHovered(null)}>
        {screens.map(({ image, label, description }, index) => (
          <button
            className="orbit-screen"
            key={image}
            type="button"
            aria-pressed={selected === index}
            aria-label={label}
            aria-describedby={`meepo-screen-description-${index}`}
            data-active={active === index}
            style={{
              "--slot": index - center,
              "--distance": Math.abs(index - center),
              zIndex: screens.length - Math.abs(index - active),
            } as CSSProperties}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(index); }}
            onFocus={(event) => {
              if (!event.currentTarget.matches(":focus-visible")) return;
              setHovered(null);
              setSelected(index);
            }}
            onClick={() => setSelected(index)}
          >
            <Image className="hero-screenshot" src={image} width={756} height={1642} alt="" preload={index === center} loading={index === center ? undefined : "eager"} />
            <span id={`meepo-screen-description-${index}`} className="sr-only">{description}</span>
          </button>
        ))}
      </div>
    </figure>
  );
}
