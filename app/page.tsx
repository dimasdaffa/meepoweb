import Image from "next/image";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, LockKeyhole,
  MapPin, QrCode, Radio, ShieldCheck, TriangleAlert,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { HeroMesh } from "@/components/hero-mesh";
import { LowerSectionMotion } from "@/components/lower-section-motion";
import { LoRaDiagram } from "@/components/lora-diagram";
import { OrbitPreview } from "@/components/orbit-preview";
import { RelayDemo } from "@/components/relay-demo";
import { SectionParticles } from "@/components/section-particles";
import { HOP_RANGE, MAX_HOPS } from "@/lib/relay";
import { cn } from "@/lib/utils";

const appStoreUrl = "https://apps.apple.com/id/app/meepo-meet-your-people/id6832473209";
const demoAction = "Try the relay demo";

const questions = [
  {
    question: "Does Meepo need mobile data?",
    answer: "Nearby iPhones running Meepo connect over Bluetooth Low Energy or peer-to-peer Wi-Fi. Local chat and group alerts work without a router, mobile data, or an internet connection when the phones can reach each other.",
  },
  {
    question: "What is Meepo’s radio range?",
    answer: "A field test reached 40 m between two phones. Relays can carry a message farther when each phone can reach the next. Walls, interference, and phone placement affect the distance in practice.",
  },
  {
    question: "How do I join a private group?",
    answer: "Create a group on an iPhone and show its invite QR code at the post. Others can scan the code or paste an invite link in Meepo. Group messages are encrypted.",
  },
  {
    question: "Can I see teammates and maps offline?",
    answer: "Orbit shows shared positions when location readings are available. Download the area map while you have internet access to use it offline. GPS accuracy can vary indoors.",
  },
  {
    question: "Where do SOS alerts go?",
    answer: "Meepo sends SOS alerts to reachable members of your group. They can acknowledge that they’re on their way. Use the relief post’s emergency channels for official response.",
  },
];

function Brand() {
  return (
    <a className="site-brand" href="#top" aria-label="Meepo home">
      <Image src="/meepo-icon.png" width={34} height={34} alt="" />
      <span>Meepo</span>
    </a>
  );
}

function DemoLink() {
  return (
    <a href="#how-it-works" className={cn(buttonVariants(), "site-action")}>
      {demoAction} <ArrowRight data-icon="inline-end" aria-hidden="true" />
    </a>
  );
}

function FeatureVisuals() {
  return (
    <div className="feature-grid grid">
      <article className="feature">
        <div className="feature-visual invite-visual" data-ui aria-hidden="true">
          <div className="sample-sheet">
            <span className="sample-icon"><QrCode /></span>
            <strong>Relief post</strong>
            <span className="sample-meta"><LockKeyhole /> Private invite</span>
          </div>
        </div>
        <div className="feature-copy">
          <h3>Private group invites</h3>
          <p>Show an invite QR code at the post so volunteers can join on their iPhones.</p>
        </div>
      </article>
      <article className="feature">
        <div className="feature-visual meeting-visual" data-ui aria-hidden="true">
          <i className="meeting-ring" /><i className="meeting-ring" /><i className="meeting-ring" />
          <div className="meeting-pin"><MapPin /></div>
          <div className="meeting-label">Meeting point</div>
        </div>
        <div className="feature-copy">
          <h3>Shared meeting points</h3>
          <p>Set one place to meet and use Orbit to see where your teammates are.</p>
        </div>
      </article>
      <article className="feature">
        <div className="feature-visual sos-visual" data-ui aria-hidden="true">
          <div className="sos-sample">
            <div><TriangleAlert /><strong>SOS active</strong></div>
            <span>Ayu is on their way <Check /></span>
          </div>
        </div>
        <div className="feature-copy">
          <h3>Group SOS alerts</h3>
          <p>Send an SOS and see when a teammate responds that they’re on their way.</p>
        </div>
      </article>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <header className="site-header nav nav-cards">
        <div className="wrap site-header-inner">
          <a className="skip-link" href="#top">Skip to content</a>
          <Brand />
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href={appStoreUrl} className={cn(buttonVariants(), "site-action")} aria-label="Open Meepo on the App Store">
            App Store <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </a>
        </div>
      </header>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="top" tabIndex={-1}>
            <section className="hero hero--centred" aria-labelledby="hero-title" data-enter>
              <HeroMesh />
              <div className="wrap hero-wrap">
                <div className="hero-text">
                  <div className="hero-copy">
                    <h1 id="hero-title">Meet Your People</h1>
                    <p>Meepo connects nearby iPhones so you can find your group, share updates, and ask for help without internet access.</p>
                    <div className="hero-actions">
                      <DemoLink />
                      <a className="text-action" href="#download">Get Meepo <ArrowDown aria-hidden="true" /></a>
                    </div>
                  </div>
                  <OrbitPreview />
                </div>
              </div>
            </section>
            <section id="features" className="content-section features-section" aria-labelledby="features-title" style={{ "--h": 1 } as React.CSSProperties}>
              <SectionParticles />
              <div className="wrap">
                <div className="section-head">
                  <h2 id="features-title">Tools for the relief post</h2>
                  <p>Keep supply updates, meeting points, and calls for help in one local group.</p>
                </div>
                <FeatureVisuals />
              </div>
            </section>
            <section id="how-it-works" className="content-section mesh-section" aria-labelledby="mesh-title" style={{ "--h": 1 } as React.CSSProperties}>
              <SectionParticles />
              <div className="wrap">
                <div className="section-head">
                  <h2 id="mesh-title">Meepo’s relay network</h2>
                  <p>Watch a signal travel from Daffa’s iPhone on the left to Hasan’s on the right. Tap a relay to switch it on or off and see how the route changes.</p>
                </div>
                <RelayDemo />
                <p className="range-note">The simulator uses {HOP_RANGE} m per hop. Actual radio range varies with the surroundings.</p>
              </div>
            </section>
            <section id="future-development" className="content-section future-section" aria-labelledby="future-title">
              <div className="wrap">
                <div className="future-intro">
                  <p className="future-kicker">Future development</p>
                  <h2 id="future-title">Offline messaging over longer distances</h2>
                  <p>We plan to use LoRa-enabled IoT relays to pass messages between groups of iPhones beyond the reach of the local mesh.</p>
                </div>
                <LoRaDiagram />
              </div>
            </section>
          </main>
          <footer id="faq" className="site-footer closing footer-statement" aria-labelledby="faq-title">
            <SectionParticles />
            <div className="wrap footer-wrap">
              <div className="faq-grid grid">
                <div className="faq-intro">
                  <div className="section-head">
                    <h2 id="faq-title">Common questions</h2>
                  </div>
                  <figure className="faq-range">
                    <figcaption><Radio aria-hidden="true" /> Simulator limits</figcaption>
                    <dl data-moment="counter-rolls">
                      <div><dt>Range per hop</dt><dd data-count>{HOP_RANGE} m</dd></div>
                      <div><dt>Max hops</dt><dd data-count>{MAX_HOPS}</dd></div>
                    </dl>
                  </figure>
                </div>
                <Accordion className="faq-list" defaultValue={[questions[0].question]}>
                  {questions.map(({ question, answer }) => (
                    <AccordionItem key={question} value={question}>
                      <AccordionTrigger>{question}</AccordionTrigger>
                      <AccordionContent><p>{answer}</p></AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <section id="download" className="app-download" aria-labelledby="download-title">
                <div className="app-download-copy">
                  <h2 id="download-title">Get Meepo for iPhone</h2>
                  <a href={appStoreUrl} className={cn(buttonVariants(), "site-action")}>
                    Download on the App Store <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                  </a>
                  <a className="text-action" href="mailto:hi.meepo@gmail.com">Contact us</a>
                </div>
                <figure className="app-download-qr">
                  <Image src="/meepo-app-store-qr.png" width={164} height={164} alt="QR code for Meepo on the App Store" />
                  <figcaption>Scan with your iPhone camera</figcaption>
                </figure>
              </section>
              <div className="footer-bottom">
                <Brand />
                <DemoLink />
              </div>
            </div>
          </footer>
        </div>
      </div>
      <LowerSectionMotion />
    </>
  );
}
