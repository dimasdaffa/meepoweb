import { expect, test } from "bun:test";
import {
  distanceBetween, findRoute, getLinks, HOP_RANGE,
  initialRelays, MAX_HOPS, recipient, sender, stations,
} from "./relay.ts";

const routeIds = (relays) => findRoute(getLinks(relays)).map(({ id }) => id);

test("the default route runs left to right through the named relays", () => {
  expect(routeIds(initialRelays)).toEqual(["daffa", "adiat", "ayu", "ivanna", "hasan"]);
});

test("nearby phones without Meepo cannot form links", () => {
  const unavailable = stations.filter(({ role }) => role === "unavailable");
  const enabled = stations.filter(({ role }) => role === "relay").map(({ id }) => id);
  expect(unavailable.some((device) => distanceBetween(device, recipient) <= HOP_RANGE)).toBe(true);
  expect(getLinks(enabled).every(({ from, to }) =>
    from.role !== "unavailable" && to.role !== "unavailable" && distanceBetween(from, to) <= HOP_RANGE,
  )).toBe(true);
});

test("switching a relay off interrupts the route until an alternate chain is enabled", () => {
  const interrupted = initialRelays.filter((id) => id !== "ayu");
  expect(routeIds(interrupted)).toEqual([]);
  expect(routeIds([...interrupted, "south", "south-east"])).toEqual([
    "daffa", "south-west", "south", "nicho", "south-east", "hasan",
  ]);
});

test("routes stop at the 15-hop limit", () => {
  function chain(hops) {
    const devices = [sender, ...Array.from({ length: hops - 1 }, (_, i) => ({ id: `test-${i}` })), recipient];
    return devices.slice(1).map((to, index) => ({ from: devices[index], to }));
  }

  expect(MAX_HOPS).toBe(15);
  expect(findRoute(chain(15))).toHaveLength(16);
  expect(findRoute(chain(16))).toEqual([]);
});
