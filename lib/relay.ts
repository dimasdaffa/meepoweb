export const HOP_RANGE = 40;
export const MAX_HOPS = 15;
export const MAP_WIDTH = 156;
export const MAP_HEIGHT = 110;

export const stations = [
  { id: "daffa", name: "Daffa", x: 15, y: 55, role: "sender" },
  { id: "north-west", name: "Meepo User", x: 26, y: 17, role: "relay" },
  { id: "adiat", name: "Adiat", x: 48, y: 51, role: "relay" },
  { id: "south-west", name: "Meepo User", x: 26, y: 92, role: "relay" },
  { id: "no-app-west", name: "No Meepo", x: 62, y: 17, role: "unavailable" },
  { id: "south", name: "Meepo User", x: 64, y: 94, role: "relay" },
  { id: "ayu", name: "Ayu", x: 79, y: 58, role: "relay" },
  { id: "nicho", name: "Nicho", x: 94, y: 93, role: "relay" },
  { id: "north-east", name: "Meepo User", x: 99, y: 15, role: "relay" },
  { id: "ivanna", name: "Ivanna", x: 108, y: 49, role: "relay" },
  { id: "south-east", name: "Meepo User", x: 129, y: 90, role: "relay" },
  { id: "no-app-east", name: "No Meepo", x: 134, y: 17, role: "unavailable" },
  { id: "hasan", name: "Hasan", x: 141, y: 55, role: "recipient" },
] as const;

export type Station = (typeof stations)[number];
export type RelayId = Extract<Station, { role: "relay" }>["id"];
export type Link = { from: Station; to: Station };

export const sender = stations[0];
export const recipient = stations[stations.length - 1];
export const relayCount = stations.filter(({ role }) => role === "relay").length;
export const initialRelays: RelayId[] = [
  "adiat", "ayu", "ivanna", "north-west", "south-west", "nicho", "north-east",
];

export function distanceBetween(from: Station, to: Station) {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

export function getLinks(relays: readonly RelayId[]): Link[] {
  const active = stations.filter(({ role, id }) =>
    role === "relay" ? relays.includes(id) : role !== "unavailable",
  );

  return active.flatMap((from, index) =>
    active.slice(index + 1).flatMap((to) =>
      distanceBetween(from, to) <= HOP_RANGE ? [{ from, to }] : [],
    ),
  );
}

export function findRoute(links: readonly Link[]): Station[] {
  const queue: Station[][] = [[sender]];
  const visited = new Set<Station["id"]>([sender.id]);

  for (const path of queue) {
    const current = path[path.length - 1];
    if (current.id === recipient.id) return path;
    if (path.length - 1 >= MAX_HOPS) continue;

    for (const { from, to } of links) {
      const neighbor = from.id === current.id ? to : to.id === current.id ? from : null;
      if (neighbor && !visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [];
}
