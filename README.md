# Meepo

English project website for Meepo, the iPhone app for offline group communication by Fantasix. The landing page shows the Happy Family group in Orbit.

## Local development

```sh
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

```sh
bun run lint
bun test
bun run build
```

The Next.js production build exports to `out/`. Serve that directory with a static host. The page uses system fonts and does not require a backend.

## Relay simulator

Toggle relay phones in the relief-site map and send the sample supply message. The simulator finds the shortest route through enabled phones, lights each hop in order, and reports whether the update reaches the relief post. The geometry is drawn to a shared scale with a 40 m maximum per link. In the iPhone app, a hop depends on a usable radio connection between two devices.

The relay coordinates and routing rules live in `lib/relay.ts`.
