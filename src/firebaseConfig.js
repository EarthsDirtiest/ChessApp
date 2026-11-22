// Replace these public Firebase web-app configuration values.
// Firebase Console → Project settings → Your apps → Web app.
export const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  databaseURL: "https://REPLACE_ME-default-rtdb.firebaseio.com",
  projectId: "REPLACE_ME",
  appId: "REPLACE_ME"
};
export const firebaseConfigured = firebaseConfig.apiKey !== "REPLACE_ME" && !firebaseConfig.databaseURL.includes("REPLACE_ME");
