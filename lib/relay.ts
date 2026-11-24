export const HOP_RANGE = 40;
export const MAP_WIDTH = 120;
export const MAP_HEIGHT = 82;

export const stations = [
  { id: "supply", name: "Supply tent", x: 13, y: 43, role: "sender" },
  { id: "ari", name: "Ari", x: 40, y: 25, role: "relay" },
  { id: "ayu", name: "Ayu", x: 72, y: 19, role: "relay" },
  { id: "adiat", name: "Adiat", x: 41, y: 61, role: "relay" },
  { id: "nicho", name: "Nicho", x: 72, y: 61, role: "relay" },
  { id: "post", name: "Relief post", x: 104, y: 43, role: "recipient" },
] as const;

export type Station = (typeof stations)[number];
export type StationId = Station["id"];
export type RelayId = Extract<Station, { role: "relay" }>["id"];
export type Link = { from: Station; to: Station; distance: number };

export const initialRelays: RelayId[] = ["ari", "ayu"];

export function distanceBetween(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

export function getLinks(relays: readonly RelayId[]): Link[] {
  const active = stations.filter(
    (station) => station.role !== "relay" || relays.includes(station.id),
  );

  return active.flatMap((from, index) =>
    active.slice(index + 1).flatMap((to) => {
      const distance = distanceBetween(from, to);
      return distance <= HOP_RANGE ? [{ from, to, distance }] : [];
    }),
  );
}

export function findRoute(links: readonly Link[]): StationId[] {
  const queue: StationId[][] = [["supply"]];
  const visited = new Set<StationId>(["supply"]);

  for (const path of queue) {
    const current = path[path.length - 1];
    if (current === "post") return path;

    for (const { from, to } of links) {
      const neighbor = from.id === current ? to.id : to.id === current ? from.id : null;
      if (neighbor && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [];
}
