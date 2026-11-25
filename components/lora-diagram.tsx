import { RadioTower } from "lucide-react";

const bridge = "M0 100 C27 10 73 10 100 100";
const phones = [[44, 36], [28, 92], [58, 129]];

function LocalMesh({ label }: { label: string }) {
  return (
    <div className="lora-mesh">
      <svg className="lora-mesh-art" viewBox="0 0 160 160" aria-hidden="true">
        <g className="lora-coverage" fill="none">
          <circle cx="80" cy="80" r="78" />
          <circle cx="80" cy="80" r="57" />
          <circle cx="80" cy="80" r="35" />
        </g>
        <path className="lora-local-path" d="M80 80 44 36 28 92 58 129 80 80 28 92" />
        {phones.map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`} className="lora-phone">
            <circle r="12" />
            <rect x="-3.5" y="-6" width="7" height="12" rx="1.6" />
            <path d="M-1 3.5h2" />
          </g>
        ))}
      </svg>
      <span className="lora-relay"><RadioTower aria-hidden="true" /></span>
      <span className="lora-mesh-label">{label}</span>
    </div>
  );
}

export function LoRaDiagram() {
  return (
    <div
      className="lora-diagram"
      role="img"
      aria-label="Proposed route: the sender’s iPhone group passes a message to a LoRa relay. A second relay receives it over LoRa and passes it to the recipient’s iPhone group."
    >
      <div className="lora-bridge">
        <span className="lora-bridge-label">LoRa radio link</span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <mask id="lora-link-mask" maskUnits="userSpaceOnUse" x="-4" y="-4" width="108" height="108">
              <path className="lora-link-reveal" d={bridge} pathLength="100" />
            </mask>
          </defs>
          <path className="lora-link-base" d={bridge} />
          <path className="lora-link-signal" d={bridge} mask="url(#lora-link-mask)" />
        </svg>
      </div>
      <LocalMesh label="Sender’s group" />
      <LocalMesh label="Recipient’s group" />
    </div>
  );
}
