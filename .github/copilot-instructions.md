Purpose
-------
This file gives concise, actionable guidance for AI coding agents to be immediately productive in the Not So Super Smash Bros repository.

High-level architecture (big picture)
-------------------------------------
- Server: Express + Socket.IO (entry: `src/server/app.js`). Serves static client from `src/client` and maintains an in-memory `rooms` object keyed by game ID. Socket events are the primary integration surface.
- View (desktop): `src/client/layout.html` loads Phaser and the game view JS (`src/client/js/main.js` + game states under `src/client/states`). This is the authoritative game renderer/logic.
- Controller (mobile): `src/client/controller.html` + `src/client/js/controller.js` — mobile pages emit input events to the server which get broadcast to the view.
- Assets: `src/client/assets/...` (sprites, sounds, fonts). `src/client/js/chars.js` contains character behaviour and animation definitions.

Core data flows & integration points
-----------------------------------
- Controller -> Server: `controller.js` emits `new-player`, `create-game`, and periodic `game-update` objects containing {right,left,jump,fire,player,firePowerUp}.
- Server: `src/server/app.js` listens for `new-player`, `create-game`, `game-update`, `game-start` and broadcasts `player-joined`, `success-join`, `invalid-room`, `start-game` and `game-update` to sockets in the room. Rooms shape: `{ id: <viewSocketId>, started: bool, players: number }`.
- View receives `game-update` (from server) and applies inputs to Phaser state code (see `src/client/js/main.js` and look under `src/client/states` for the concrete state implementations).

Developer workflows (how to run & debug)
--------------------------------------
- Install dependencies: `npm install` (inspect `package.json` for devDependencies like `gulp`, `browser-sync`).
- Dev: the project historically uses Gulp. Two common approaches:
  - Run the dev live-reload flow: `gulp` (default task starts `browser-sync` which proxies `localhost:3000` and serves on port 5000; `nodemon` runs the server defined in `gulpfile.js` -> `./src/server/app.js`).
  - Run server only: `npm start` (runs `node ./src/server/app.js`). This is useful for debugging server/socket behavior.
- Lint: `gulp lint` runs jshint on `src/client/js/*.js` per `gulpfile.js`.
- Build: `gulp build` runs `clean`, `lint`, CSS/JS minification, `copy-server-files` and `connectDist`. Note: the build expects `./dist/server/bin/www` in `nodemonDistConfig` — if you rely on production wiring, verify `dist` artifacts (this project historically expects running `gulp` during development).

Project-specific conventions & gotchas
------------------------------------
- Player indices are 0..3 (controller index => player id). Many arrays and sprite names are indexed by controller number (see `src/client/js/controller.js` and `src/client/js/chars.js`). Avoid changing those magic indices without updating all usages.
- Health/powerups: characters start with `health = 100` and `powerUp` is used as numeric flag (see `chars.js`). Text for HP is created via `game.add.text(...)` using PressStart2P font available in assets.
- Room lifecycle: created via `create-game` (server stores `rooms[gameRoom] = {id: viewId}`) and `game-start` sets `rooms[gameRoom].started = true`.
- Event names are literal strings; keep them consistent across server and both clients: `create-game`, `new-player`, `game-update`, `game-start`, `player-joined`, `success-join`, `success-create`, `invalid-room`, `start-game`.

Concrete examples (from repository)
----------------------------------
- Client sends inputs every ~30ms:
  socket.emit('game-update', { right: right, left: left, jump: jump, fire: fire, player: player, firePowerUp: firePowerUp });
- Server creates a room and stores the view id:
  rooms[data.gameRoom] = { id: data.viewId }; socket.join(data.viewId); socket.emit('success-create', data);

Where to look when changing game logic
-------------------------------------
- Server socket handling and room model: `src/server/app.js` (single file server pattern — global `rooms` object).
- Controller input and UI: `src/client/js/controller.js`.
- Game boot and state loading: `src/client/js/main.js` (adds and starts Phaser states). Look under `src/client/states/` for the game state implementations.
- Character behavior: `src/client/js/chars.js` (firing, power-ups, health handling, animations). Use this file for animation indices, fire rates and collision handling.

Editing guidance for AI agents
-----------------------------
- When modifying socket events change both server and the relevant client files (controller and view/state code). Search for the event string across the repo before renaming.
- Keep player indices/arrays in sync: controller index -> sprite naming pattern and HP text positions (see `chars.js` switch on controller index).
- Prefer small, reversible changes. The project has no unit tests; validate by running `npm start` and opening the view and controller pages, or by running `gulp` for live reload.

If anything is unclear or you'd like the doc to include more examples (e.g. precise state file references, or a short checklist for adding a new character), tell me which area to expand and I'll iterate.
