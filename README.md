# ChessApp

Modern dark chess website with two modes:
- **Play a friend:** private multiplayer rooms using Firebase Realtime Database and anonymous authentication, no Lichess account.
- **Lichess online:** OAuth/token login and Lichess Board API.

## Enable private multiplayer (required)

1. Create a project at https://console.firebase.google.com/.
2. Under **Build → Authentication → Sign-in method**, enable **Anonymous**.
3. Under **Build → Realtime Database**, create a database in your preferred region.
4. Open **Realtime Database → Rules** and replace the rules with the contents of [database.rules.json](database.rules.json). Click **Publish**. Do not use public test-mode rules in production.
5. Under **Project settings → Your apps**, register a Web app and copy its Firebase configuration values into [src/firebaseConfig.js](src/firebaseConfig.js). The databaseURL must match the Realtime Database URL, including the region if applicable.
6. Commit those changes. Firebase Web config is public configuration, **not** an admin credential. Never commit Firebase service account keys or private secrets.
7. Under GitHub repository **Settings → Pages**, select **GitHub Actions** as the build source. The included workflow builds and deploys on pushes to main.

Website: https://earthsdirtiest.github.io/ChessApp/

## Play a friend

Both users visit the site and select **Play a friend**. The host enters a display name, chooses a color, and clicks **Create private game**. Send the six-character room code or copy the invite link to a friend. The friend enters their name, types the code, and clicks **Join**. Moves synchronize automatically.

Firebase anonymous auth identifies each browser. If you clear site data, change browsers, or use private browsing, you may lose your player identity and access to that room. Room codes are not passwords. Firebase database rules restrict writes to the players and their turn but do not independently verify full chess legality. This is a casual friends feature, **not** a tamper-proof rated platform. Firebase stores the moves and room data.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Lichess

The Lichess mode uses OAuth PKCE or a personal access token, and requires the browser's network to reach the Lichess API. Fair play: do not enable engine hints during live human games.
