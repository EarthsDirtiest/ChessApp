# ChessApp

A modern dark chess interface connected to Lichess, deployed through GitHub Pages.

## Deploy
1. In **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.
2. The included workflow builds Vite and deploys on every push to main.
3. Open https://earthsdirtiest.github.io/ChessApp/ after the workflow succeeds.

## Local development
Run `npm install` then `npm run dev`.

## Features
- Lichess OAuth2 PKCE login (no client secret)
- Lichess Board API game and event streams
- Casual seek matchmaking and direct challenges
- Legal move validation, promotions, move history, resign, flip board
- Responsive dark UI

## Important
This is an initial implementation and live OAuth/gameplay has not yet been tested. Never use engine assistance during live games against humans. Clocks display the most recent server values rather than a continuously ticking local timer. OAuth tokens are stored in browser sessionStorage and are cleared by logging out.
