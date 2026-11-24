"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight, Ban, Check, Pause, Play, Radio, RotateCcw, Smartphone, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  distanceBetween, findRoute, getLinks, HOP_RANGE, initialRelays,
  MAP_HEIGHT, MAP_WIDTH, MAX_HOPS, recipient, relayCount, sender, stations,
  type Link, type RelayId, type Station,
} from "@/lib/relay";

function position({ x, y }: Station): CSSProperties {
  return { left: `${x / MAP_WIDTH * 100}%`, top: `${y / MAP_HEIGHT * 100}%` };
}

function edgeStyle({ from, to }: Link): CSSProperties {
  return {
    ...position(from),
    width: `${distanceBetween(from, to) / MAP_WIDTH * 100}%`,
    rotate: `${Math.atan2(to.y - from.y, to.x - from.x)}rad`,
  };
}

const hopMs = 530;

export function RelayDemo() {
  const [relays, setRelays] = useState<RelayId[]>(initialRelays);
  const [paused, setPaused] = useState(false);
  const links = getLinks(relays);
  const route = findRoute(links);
  const hops = Math.max(0, route.length - 1);
  const routeKey = route.map(({ id }) => id).join("/");
  const loopMs = hops * hopMs + 950;
  const AnimationIcon = paused ? Play : Pause;

  function toggleRelay(id: RelayId) {
    setRelays((previous) => previous.includes(id)
      ? previous.filter((relay) => relay !== id)
      : [...previous, id]);
  }

  return (
    <div className="relay-console" data-ui data-paused={paused}>
      <div className="relay-toolbar">
        <div className="relay-toolbar-label"><Radio aria-hidden="true" /> Relay simulator</div>
        <div className="relay-signal"><WifiOff aria-hidden="true" /> No cell service</div>
      </div>
      <div className="relay-layout">
        <div className="relay-map" role="group" aria-label="Phone network from Daffa to Hasan">
          <div className="map-caption">
            <span>Sender <strong>{sender.name}</strong></span>
            <ArrowRight aria-hidden="true" />
            <span>Receiver <strong>{recipient.name}</strong></span>
          </div>
          <div className="map-field" style={{ aspectRatio: MAP_WIDTH / MAP_HEIGHT, "--hop-scale": `${HOP_RANGE / MAP_WIDTH * 100}%` } as CSSProperties}>
            <div className="relay-range" style={position(sender)} aria-hidden="true" />
            {links.map((edge) => {
              const { from, to } = edge;
              const index = route.findIndex(({ id }, step) =>
                (id === from.id && route[step + 1]?.id === to.id) ||
                (id === to.id && route[step + 1]?.id === from.id),
              );

              return (
                <div className="relay-edge" data-route={index >= 0} key={`${from.id}-${to.id}`} style={edgeStyle(edge)} aria-hidden="true">
                  {index >= 0 && (
                    <i
                      key={routeKey}
                      className="relay-pulse"
                      data-reverse={route[index].id !== from.id}
                      style={{
                        "--relay-loop": `${loopMs}ms`,
                        "--pulse-start": `${index * hopMs / loopMs * 100}%`,
                        "--pulse-end": `${(index + 1) * hopMs / loopMs * 100}%`,
                      } as CSSProperties}
                    />
                  )}
                </div>
              );
            })}
            {stations.map((station) => {
              const { id, name, role } = station;
              const onRoute = route.includes(station);
              return (
                <div className="map-station" key={id} style={position(station)} data-role={role} data-top-row={station.y < 25}>
                  {role === "relay" ? (
                    <button
                      type="button"
                      className="map-node"
                      aria-label={name === "Meepo User" ? `${name}, ${id} relay` : `${name} relay`}
                      aria-pressed={relays.includes(id)}
                      data-enabled={relays.includes(id)}
                      data-on-route={onRoute}
                      onClick={() => toggleRelay(id)}
                    >
                      <Smartphone aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="map-node" data-enabled={role !== "unavailable"} data-on-route={onRoute}>
                      <Smartphone aria-hidden="true" />
                      {role === "unavailable" && <Ban className="map-node-ban" aria-hidden="true" />}
                    </span>
                  )}
                  <span className="map-node-label">{name}</span>
                </div>
              );
            })}
            <div className="map-key">
              <span className="map-scale" aria-hidden="true"><i /></span>
              <span>{HOP_RANGE} m per hop</span>
            </div>
          </div>
        </div>
        <div className="relay-side">
          <div className="relay-side-top">
            <div className="relay-counter"><span>Relays on</span><strong>{relays.length} / {relayCount}</strong></div>
            <div className="relay-counter"><span>Route</span><strong>{hops ? `${hops} hops` : "No path"}</strong></div>
            <div className="relay-counter"><span>Max hops</span><strong>{MAX_HOPS}</strong></div>
          </div>
          <div className="relay-feedback" role="status" aria-atomic="true" data-connected={hops > 0}>
            <strong>{hops > 0 ? <><Check aria-hidden="true" /> Route connected</> : "Route interrupted"}</strong>
            <span>{hops > 0 ? route.map(({ name }) => name).join(" → ") : "Turn on nearby relays to reconnect Daffa and Hasan."}</span>
          </div>
          <ul className="relay-legend" aria-label="Map legend">
            <li><i data-state="route" /> On the route</li>
            <li><i data-state="available" /> Relay on</li>
            <li><i /> Relay off</li>
            <li><Ban aria-hidden="true" /> Meepo not installed</li>
          </ul>
          <div className="relay-actions">
            {/* <Button className="site-action relay-pause" type="button" disabled={hops === 0} onClick={() => setPaused((current) => !current)}>
              <AnimationIcon data-icon="inline-start" aria-hidden="true" />
              {paused ? "Resume animation" : "Pause animation"}
            </Button> */}
            <Button
              className="site-action relay-reset" variant="link" type="button"
              onClick={() => { setRelays(initialRelays); setPaused(false); }}
            >
              <RotateCcw data-icon="inline-start" aria-hidden="true" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
