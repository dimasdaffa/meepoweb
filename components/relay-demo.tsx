"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  ArrowRight, Check, Radio, RotateCcw, Send, Smartphone, Tent, Warehouse, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  findRoute, getLinks, HOP_RANGE, initialRelays, MAP_HEIGHT, MAP_WIDTH, stations,
  type Link, type RelayId, type Station, type StationId,
} from "@/lib/relay";

const hopTime = 750;
type Run = "idle" | "sending" | "delivered" | "blocked";

function position({ x, y }: Station): CSSProperties {
  return { left: `${x / MAP_WIDTH * 100}%`, top: `${y / MAP_HEIGHT * 100}%` };
}

function edgeStyle({ from, to, distance }: Link): CSSProperties {
  return {
    ...position(from),
    width: `${distance / MAP_WIDTH * 100}%`,
    rotate: `${Math.atan2(to.y - from.y, to.x - from.x)}rad`,
  };
}

function StationIcon({ role }: { role: Station["role"] }) {
  const Icon = role === "sender" ? Tent : role === "recipient" ? Warehouse : Smartphone;
  return <Icon aria-hidden="true" />;
}

export function RelayDemo() {
  const [relays, setRelays] = useState<RelayId[]>(initialRelays);
  const [run, setRun] = useState<Run>("idle");
  const [hop, setHop] = useState(0);
  const links = getLinks(relays);
  const route = findRoute(links);
  const hops = Math.max(0, route.length - 1);
  const reached = run === "sending" || run === "delivered" ? route.slice(0, hop + 1) : [];
  const stationNames = Object.fromEntries(stations.map((station) => [station.id, station.name]));

  useEffect(() => {
    if (run !== "sending") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setHop(hop + 1);
      if (hop + 1 === hops) setRun("delivered");
    }, reducedMotion ? 150 : hopTime);
    return () => window.clearTimeout(timer);
  }, [run, hop, hops]);

  function clearRun() {
    setRun("idle");
    setHop(0);
  }

  function toggleRelay(id: RelayId) {
    clearRun();
    setRelays((previous) => previous.includes(id)
      ? previous.filter((relay) => relay !== id)
      : [...previous, id]);
  }

  function sendMessage() {
    setHop(0);
    setRun(hops > 0 ? "sending" : "blocked");
  }

  const headline = {
    idle: "Ready to send",
    sending: "Message in transit",
    delivered: "Message delivered",
    blocked: "No route to the post",
  }[run];
  const detail = {
    idle: "Select a relay on the map to change the route.",
    sending: `${stationNames[route[hop]]} → ${stationNames[route[hop + 1]]}`,
    delivered: `The relief post received the update in ${hops} hops.`,
    blocked: "Turn on relays to make a route with gaps of 40 m or less.",
  }[run];

  function linkHop(from: StationId, to: StationId) {
    return route.findIndex((id, index) =>
      (id === from && route[index + 1] === to) || (id === to && route[index + 1] === from),
    );
  }

  return (
    <div className="relay-console" data-ui>
      <div className="relay-toolbar">
        <div className="relay-toolbar-label"><Radio aria-hidden="true" /> Relay simulator</div>
        <div className="relay-signal"><WifiOff aria-hidden="true" /> No cell service</div>
      </div>
      <div className="relay-layout">
        <div className="relay-map" role="group" aria-label="Relief site map">
          <div className="map-caption"><span /> Relief site</div>
          <div className="map-field" style={{ "--hop-scale": `${HOP_RANGE / MAP_WIDTH * 100}%` } as CSSProperties}>
            <div className="relay-range" style={position(stations[0])} aria-hidden="true" />
            {links.map((edge) => {
              const index = linkHop(edge.from.id, edge.to.id);
              const active = index >= 0 && run === "sending" && index === hop;
              const passed = index >= 0 && index < hop;
              return (
                <div
                  className="relay-edge"
                  data-route={index >= 0}
                  data-passed={passed}
                  key={`${edge.from.id}-${edge.to.id}`}
                  style={edgeStyle(edge)}
                  aria-hidden="true"
                >
                  {active && <i className="relay-pulse" data-reverse={route[hop] !== edge.from.id} />}
                </div>
              );
            })}
            {stations.map((station) => {
              const { id, name, role } = station;
              const hasMessage = reached.includes(id);
              const enabled = role !== "relay" || relays.includes(id);
              return (
                <div className="map-station" key={id} style={position(station)} data-role={role}>
                  {role === "relay" ? (
                    <button
                      type="button"
                      className="map-node"
                      aria-label={`${name} relay`}
                      aria-pressed={enabled}
                      data-enabled={enabled}
                      data-reached={hasMessage}
                      onClick={() => toggleRelay(id)}
                    >
                      <StationIcon role={role} />
                    </button>
                  ) : (
                    <span className="map-node" data-enabled data-reached={hasMessage}>
                      <StationIcon role={role} />
                    </span>
                  )}
                  <span className="map-node-label">{name}</span>
                </div>
              );
            })}
            <div className="map-key">
              <span className="map-scale" aria-hidden="true"><i /></span>
              <span>{HOP_RANGE} m hop limit</span>
            </div>
          </div>
        </div>
        <div className="relay-side">
          <div className="relay-side-top">
            <div className="relay-counter">
              <span>Relays on</span><strong>{relays.length} / 4</strong>
            </div>
            <div className="relay-counter">
              <span>Route</span><strong>{hops ? `${hops} hops` : "No path"}</strong>
            </div>
          </div>
          <div className="relay-message">
            <div className="relay-message-label"><Send aria-hidden="true" /> Supply update</div>
            <p>Water is ready at Tent A.</p>
          </div>
          <div className="relay-feedback" role="status" aria-atomic="true" data-state={run}>
            <strong>{run === "delivered" && <Check aria-hidden="true" />}{headline}</strong>
            <span>{detail}</span>
          </div>
          <div className="relay-actions">
            <Button className="site-action" type="button" disabled={run === "sending"} onClick={sendMessage}>
              Send message <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              className="site-action relay-reset" variant="link" type="button"
              onClick={() => { setRelays(initialRelays); clearRun(); }}
            >
              <RotateCcw data-icon="inline-start" aria-hidden="true" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
