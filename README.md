# music hub

a diy airplay receiver + smart speaker built on a raspberry pi 4 with 7in touchscreen. streams live track info, artwork, and playback state to a custom touchscreen ui, with real controls for play/pause/skip/volume.

## what's running under the hood

- hardware: raspberry pi 4, official touchscreen, gpio/i2s dac hat (pcm5122), powered studio monitors
- audio: shairport-sync (airplay receiver)
- backend: node.js + typescript, fastify, websockets
- frontend: react + typescript, vite
- database: sqlite + prisma (play history + stats)
- controls: d-bus, talking to shairport-sync's remote control interface
- containerized: docker + docker compose (backend + frontend, shairport-sync runs native on the pi)

more coming soon - working on adding hand-gesture control next using a custom-trained model.
