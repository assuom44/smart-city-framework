# Smart City Dashboard

Next.js dashboard for real-time Smart City monitoring. It consumes REST APIs for historical data and Socket.IO events for live updates.

## Stack

- Next.js 16.3.3
- React 19.2.7
- TypeScript
- Tailwind CSS 4
- Leaflet / React Leaflet
- Recharts 3.10.1
- Socket.IO client 4.8.3

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Set the API URL with:

```text
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

## Production build

```bash
npm install
npm run build
npm start
```

The Docker image uses the Next.js standalone output. The package lockfile is intentionally regenerated after the 2.0 dependency upgrade; run `npm install` once on a connected development machine to create a local lockfile.
