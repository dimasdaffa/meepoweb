"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ArrowUpRight, MessageSquareHeart, QrCode } from "lucide-react";

gsap.registerPlugin(useGSAP);

const feedbackUrl = "https://docs.google.com/forms/d/163S7_O2uzDv4CqrhHazqXpI7cqtHb9PWc_te2lgn8Ug/viewform?edit_requested=true";

export function FeedbackFab() {
  const controls = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ delay: 1.1 })
        .to(controls.current, { y: -12, duration: .23, ease: "power2.out" })
        .to(controls.current, { y: 0, duration: .68, ease: "bounce.out", clearProps: "transform" });
    });
    return () => media.revert();
  }, { scope: controls });

  return (
    <>
      <div className="feedback-fab" ref={controls}>
        <a className="feedback-link" href={feedbackUrl} target="_blank" rel="noopener noreferrer">
          <span className="feedback-icon"><MessageSquareHeart aria-hidden="true" /></span>
          Give us feedback
          <ArrowUpRight className="feedback-arrow" aria-hidden="true" />
        </a>
        <button className="feedback-qr-toggle" type="button" popoverTarget="feedback-qr" aria-label="Show feedback QR code">
          <QrCode aria-hidden="true" />
        </button>
      </div>
      <div id="feedback-qr" className="feedback-qr" popover="auto" role="group" aria-label="Feedback QR code">
        <a href={feedbackUrl} target="_blank" rel="noopener noreferrer" aria-label="Open the Meepo feedback form">
          <Image src="/meepo-feedback-qr.png" width={176} height={176} alt="" />
        </a>
        <p>Scan or tap to give feedback</p>
      </div>
    </>
  );
}
