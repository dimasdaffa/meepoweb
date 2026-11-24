import Image from "next/image";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, Crosshair, LockKeyhole,
  MapPin, MessageCircle, QrCode, Radio, ShieldCheck, TriangleAlert,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { HeroMesh } from "@/components/hero-mesh";
import { RelayDemo } from "@/components/relay-demo";
import { SectionParticles } from "@/components/section-particles";
import { distanceBetween, HOP_RANGE, stations } from "@/lib/relay";
import { cn } from "@/lib/utils";

const appStoreUrl = "https://apps.apple.com/id/app/meepo-meet-your-people/id6832473209";
const demoAction = "Try the relay demo";
const siteSpan = Math.round(distanceBetween(stations[0], stations[stations.length - 1]));

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

function OrbitPreview() {
  return (
    <div className="hero-orbit">
      <figure className="hero-stage" data-ui data-enter-media>
        <figcaption className="stage-caption"><Crosshair aria-hidden="true" /> Meepo Orbit</figcaption>
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
      <ul className="orbit-callouts" aria-label="Meepo feature examples">
        <li className="orbit-callout orbit-callout--chat">
          <span className="orbit-callout-icon"><MessageCircle aria-hidden="true" /></span>
          <div>
            <strong>Offline group chat</strong>
            <p>Mom: I’m at the entrance.</p>
          </div>
        </li>
        <li className="orbit-callout orbit-callout--meeting">
          <span className="orbit-callout-icon"><MapPin aria-hidden="true" /></span>
          <div>
            <strong>Meeting point</strong>
            <p>Dad pinned the entrance.</p>
          </div>
        </li>
        <li className="orbit-callout orbit-callout--sos">
          <span className="orbit-callout-icon"><TriangleAlert aria-hidden="true" /></span>
          <div>
            <strong>Group SOS</strong>
            <p>Sis is on her way to help.</p>
          </div>
        </li>
      </ul>
    </div>
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
      <main id="top">
        <section className="hero hero--centred" aria-labelledby="hero-title" data-enter>
          <HeroMesh />
          <div className="wrap hero-wrap">
            <div className="hero-text">
              <div className="hero-copy">
                <div className="hero-fact"><span className="status-dot" /> Offline mesh for iPhone</div>
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
              <p>Nearby phones can pass an encrypted message along. Switch relays on or off, then send an update from the supply tent.</p>
            </div>
            <RelayDemo />
            <p className="range-note">The simulator uses a {HOP_RANGE} m hop limit. Actual radio range varies with the surroundings.</p>
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
                <figcaption><Radio aria-hidden="true" /> Distances in the simulator</figcaption>
                <dl data-moment="counter-rolls">
                  <div><dt>Maximum hop</dt><dd data-count>{HOP_RANGE} m</dd></div>
                  <div><dt>Tent to post</dt><dd data-count>{siteSpan} m</dd></div>
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
            </div>
            <figure className="app-download-qr">
              <Image src="/meepo-app-store-qr.png" width={164} height={164} alt="QR code for Meepo on the App Store" />
              <figcaption>Scan with your iPhone camera</figcaption>
            </figure>
          </section>
          <div className="footer-bottom">
            <Brand />
            <p><ShieldCheck aria-hidden="true" /> An iPhone project by Fantasix</p>
            <DemoLink />
          </div>
        </div>
      </footer>
    </>
  );
}
