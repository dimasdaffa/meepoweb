import { expect, test } from "bun:test";
import { findRoute, getLinks, HOP_RANGE, initialRelays } from "./relay.ts";

test("an enabled link at exactly 40 metres reaches the post", () => {
  const links = getLinks(initialRelays);
  expect(HOP_RANGE).toBe(40);
  expect(links.find(({ from, to }) => from.id === "ayu" && to.id === "post")?.distance).toBe(40);
  expect(links.every(({ distance }) => distance <= HOP_RANGE)).toBe(true);
  expect(findRoute(links)).toEqual(["supply", "ari", "ayu", "post"]);
});

test("a disabled relay can cut the route or be replaced by an alternate path", () => {
  expect(findRoute(getLinks(["ayu"]))).toEqual([]);
  expect(findRoute(getLinks(["adiat", "nicho"]))).toEqual(["supply", "adiat", "nicho", "post"]);
});
