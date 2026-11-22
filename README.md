# ChessApp

A modern dark GitHub Pages chess interface with three independent modes:

- **Chess lab:** offline two-sided board for testing chess rules, checkmate, draws, promotions, castling, en passant, undo/redo, FEN and PGN import/export. Stockfish is not implemented.\n- **Play a friend:** WebRTC peer-to-peer multiplayer, using manual offer/answer signaling. No Firebase, database, account, or chess server.
- **Lichess online:** Lichess OAuth / personal API token and Board API live games.

## Deploy

1. Open repository **Settings → Pages** and set the build source to **GitHub Actions**.
2. The workflow builds and deploys when changes are pushed to main.
3. Visit https://earthsdirtiest.github.io/ChessApp/ after the deployment succeeds.

## Play a friend (manual signaling)

1. Both players open ChessApp → **Play a friend**.
2. Host chooses White or Black and clicks **Create game / offer**.
3. Host copies the full offer code and sends it to the guest (for example via chat).
4. Guest pastes the offer and clicks **Join and generate answer**.
5. Guest copies the full answer code and sends it to the host.
6. Host pastes the answer and clicks **Connect to friend**.
7. Wait until both clients say **connected**. Make moves directly on the board.

The offer/answer codes are long because they contain WebRTC session and network candidate information. Share them privately. A short Game ID requires a signaling service, which this implementation intentionally avoids.

## Limitations

- Both players must keep their tabs open. There is no persistence, matchmaking, reconnection or server-side arbitration.
- Public STUN servers are used for connection discovery. Restrictive networks may require a TURN relay; this backend-free version has no TURN configuration and cannot guarantee connectivity.
- The browser uses chess.js for legal move validation and checks incoming move legality. No rated anti-cheat guarantees.
- WebRTC offer/answer codes can contain IP addresses or network details; do not post them publicly.
- The current implementation is a first version and has not yet been tested between two browsers.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Lichess

Lichess mode requires access to the Lichess API from the browser. Fair play rules prohibit engine assistance in live games against humans.

## Chess Lab

Choose **Chess lab** from the navigation. Click a piece and a legal destination to play for whichever side is to move. The board uses chess.js legal move and game-over rules, matching the rules engine in live games. Reset starts a new standard game; Undo/Redo navigates the local move line; selecting an earlier position and playing a new move creates a new variation (replaces the old continuation). Flip changes orientation. FEN loads a position, PGN replays a game, and export buttons copy the current FEN or full recorded PGN. No account or network is required once the page has loaded. The current session is not persisted across refreshes. Stockfish is intentionally deferred.
