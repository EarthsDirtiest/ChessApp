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

## Board annotations

On Chess Lab and Play a friend, right-click and drag from one square to another to draw an orange arrow. Right-click without dragging to highlight a square. Repeat an annotation to remove it, or left-click to clear all. Annotations are local to the browser, never sent to the opponent, and clear when the position changes. Desktop mouse interaction is supported; touch gesture drawing is not yet implemented.

## Chess Lab board editor

Chess Lab includes **Board Setup → Edit board**. In editor mode, turns and legal-move restrictions are disabled. Choose **Move freely** to select a piece then click any destination, **Add / replace** to choose a piece and color and place it anywhere, or **Remove** to erase a square. Use **Clear board**, **Starting setup**, or **Copy setup FEN**. Select the side to move, then click **Use position in legal play** to return to chess.js-validated play. Positions with missing kings or other invalid FEN may be rejected. Editor FEN resets castling and en passant rights; for precise rights, import a complete FEN using the existing import tools. The editor does not implement Stockfish.

## Chess Lab: drag and drop + Stockfish

Drag pieces onto destination squares in Chess Lab. In legal-play mode only legal moves are accepted and pawn promotion opens a choice menu; in board-editor **Move freely** mode pieces can be dragged to any square regardless of turn or chess rules. Click-to-move remains available. Desktop browser drag-and-drop is implemented; touch drag is not guaranteed.

Stockfish 19 Lite (single-threaded WebAssembly) runs locally **only in Chess Lab**. The analysis panel shows a live evaluation from White's perspective, search depth and a best-line continuation in SAN. It reanalyzes after moves, undo/redo, reset, FEN/PGN imports, or edits. Enable/disable it or adjust search depth (8–20). The engine is distributed as static JS/WASM assets copied from the npm package during the GitHub Pages build; no analysis API or backend is required. Stockfish is not loaded by the Lichess or friend-game components. Unrestricted editor positions may be invalid for chess-engine analysis.

Stockfish.js is GPL-3.0 licensed; preserve the corresponding license notices and source obligations when redistributing the engine.

## Opening recognition (Chess Lab)

The Chess Lab opening panel identifies a curated set of ECO openings and named variations from the legal move history, matching the longest known move prefix. It updates on move, undo, redo, and PGN replay. Custom FEN positions and unrestricted board edits have no reliable opening history, so opening recognition is disabled there. The current database is curated rather than exhaustive and does not yet recognize transpositions (different move orders leading to the same position). This feature is separate from Stockfish; Stockfish evaluates the position, while the opening database supplies names.
