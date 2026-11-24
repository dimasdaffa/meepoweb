import Image from "next/image";
import { HeroMesh } from "@/components/hero-mesh";

export function OrbitPreview() {
  return (
    <figure className="hero-stage" data-ui data-enter-media>
      <div className="stage-grid" aria-hidden="true" />
      <div className="stage-rings" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <HeroMesh placement="orbit" />
      <Image
        className="hero-screenshot"
        src="/meepo-orbit-happy-family.webp"
        width={162}
        height={352}
        alt="Meepo Orbit showing the four members of the Happy Family group and their positions."
        preload
      />
    </figure>
  );
}
