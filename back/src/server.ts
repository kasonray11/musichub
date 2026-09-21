// ============================================================================
// PI MUSIC HUB - BACKEND SERVER (Phase 3: real data + optimistic controls)
// ============================================================================
import Fastify from "fastify";
import websocketPlugin from "@fastify/websocket";
import cors from "@fastify/cors";
import type { WebSocket } from "ws";
import type { NowPlaying } from "./types.js";
import { listenForMetadata, setPlayingState, setVolumePercent } from "./metadatalistener.js";
import { playPause, nextTrack, previousTrack, toggleMute, setVolume } from "./remotecontrol.js";
import { logPlayEvent, getRecentHistory, getMostPlayed } from "./db.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(websocketPlugin);

let latestNowPlaying: NowPlaying | null = null;
const connectedSockets = new Set<WebSocket>();

function broadcast(data: NowPlaying) {
  latestNowPlaying = data;
  const payload = JSON.stringify(data);
  for (const socket of connectedSockets) {
    socket.send(payload);
  }
}

function handleMetadataUpdate(data: NowPlaying) {
  const isNewTrack = data.track !== latestNowPlaying?.track;


  if (isNewTrack) {
    console.log(`[db-debug] attempting to log play event for "${data.track}"`);
    logPlayEvent(data.track, data.artist, data.album)
      .then(() => console.log(`[db-debug] SUCCESS logging "${data.track}"`))
      .catch((err) => {
        console.log(`[db-debug] FAILED logging "${data.track}":`, err);
        app.log.error(err, "Failed to log play event");
      });
  }

  broadcast(data);
}

app.get("/health", async () => {
  return { status: "ok", uptimeSeconds: process.uptime() };
});

app.post("/control/playpause", async (request, reply) => {
  try {
    await playPause();

    const newIsPlaying = !(latestNowPlaying?.isPlaying ?? false);
    setPlayingState(newIsPlaying);

    if (latestNowPlaying) {
      broadcast({ ...latestNowPlaying, isPlaying: newIsPlaying });
    }

    return { status: "ok" };
  } catch (err) {
    app.log.error(err);
    reply.code(502);
    return { status: "error", message: "Could not reach shairport-sync's remote control interface" };
  }
});

app.post("/control/next", async (request, reply) => {
  try {
    await nextTrack();
    setPlayingState(true);
    if (latestNowPlaying) {
      broadcast({ ...latestNowPlaying, isPlaying: true });
    }
    return { status: "ok" };
  } catch (err) {
    app.log.error(err);
    reply.code(502);
    return { status: "error", message: "Could not reach shairport-sync's remote control interface" };
  }
});

app.post("/control/previous", async (request, reply) => {
  try {
    await previousTrack();
    setPlayingState(true);
    if (latestNowPlaying) {
      broadcast({ ...latestNowPlaying, isPlaying: true });
    }
    return { status: "ok" };
  } catch (err) {
    app.log.error(err);
    reply.code(502);
    return { status: "error", message: "Could not reach shairport-sync's remote control interface" };
  }
});

app.post<{ Body: { percent: number } }>("/control/volume", async (request, reply) => {
  const { percent } = request.body;

  if (typeof percent !== "number" || Number.isNaN(percent)) {
    reply.code(400);
    return { status: "error", message: "Expected a numeric 'percent' in the request body" };
  }

  try {
    await setVolume(percent);
    setVolumePercent(percent);
    if (latestNowPlaying) {
      broadcast({ ...latestNowPlaying, volumePercent: percent });
    }

    return { status: "ok" };
  } catch (err) {
    app.log.error(err);
    reply.code(502);
    return { status: "error", message: "Could not reach shairport-sync's remote control interface" };
  }
});

app.post("/control/mute", async (request, reply) => {
  try {
    await toggleMute();
    return { status: "ok" };
  } catch (err) {
    app.log.error(err);
    reply.code(502);
    return { status: "error", message: "Could not reach shairport-sync's remote control interface" };
  }
});

app.get("/history", async () => {
  return getRecentHistory(100);
});

app.get("/stats/most-played", async () => {
  return getMostPlayed(20);
});

listenForMetadata(handleMetadataUpdate);

app.register(async (app) => {
  app.get("/ws/now-playing", { websocket: true }, (socket) => {
    connectedSockets.add(socket);
    app.log.info(`Touchscreen UI connected (${connectedSockets.size} total)`);

    if (latestNowPlaying) {
      socket.send(JSON.stringify(latestNowPlaying));
    }

    socket.on("close", () => {
      connectedSockets.delete(socket);
      app.log.info(`Touchscreen UI disconnected (${connectedSockets.size} total)`);
    });
  });
});

const PORT = 3000;

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`\nBackend running:`);
  console.log(`  REST health check -> http://localhost:${PORT}/health`);
  console.log(`  WebSocket feed    -> ws://localhost:${PORT}/ws/now-playing\n`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}