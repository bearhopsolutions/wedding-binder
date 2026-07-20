# Wedding Binder

A single self-contained `index.html` wedding planning binder for Nichole & Kevin — sections cover the couple, wedding party, vendors, budget, guest list, ceremony/reception details, checklists, day-of run of show, coordinator handoff notes, and post-wedding/honeymoon to-dos.

This repo is **public** (required for GitHub Pages on the free plan). The page itself is passcode-protected — the passcode is hashed in the source, not stored in plaintext, but this is a casual-visitor deterrent, not real security. Don't rely on it to protect sensitive information.

## Live site

https://bearhopsolutions.github.io/wedding-binder/

## Data storage

- Every visiting browser caches its own copy in `localStorage` so the page works offline and loads instantly.
- If `SHEETS_WEBAPP_URL` (near the top of the `<script>` in `index.html`) is set, the page also syncs to a Google Sheet through the Apps Script in `apps-script/Code.gs`, so edits show up across devices/browsers.
- Writes to the Sheet require the same passcode as the page (sent as a token), so a stranger with just the Apps Script URL can't overwrite your data — but again, this is a deterrent, not real security.

## Google Sheets sync setup (one-time)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet — name it whatever you like, e.g. "Wedding Binder Data".
2. **Extensions > Apps Script**.
3. Delete the placeholder code and paste in the contents of `apps-script/Code.gs` from this repo.
4. Click the save icon, name the project (e.g. "Wedding Binder Backend").
5. **Deploy > New deployment**, click the gear next to "Select type" and choose **Web app**.
6. Set **Execute as: Me**, **Who has access: Anyone**, then click **Deploy**.
7. Google will ask you to authorize the script — click through (you'll see an "unverified app" warning since it's your own personal script; click **Advanced > Go to [project name] (unsafe) > Allow**).
8. Copy the **Web app URL** (ends in `/exec`).
9. Paste that URL into `SHEETS_WEBAPP_URL` in `index.html` (or send it back and it'll get wired in for you).

If you ever change the passcode, update it in both `index.html` (`GATE_HASH`) and `apps-script/Code.gs` (`AUTH_TOKEN`), then redeploy the Apps Script as a **new version** of the same deployment (Deploy > Manage deployments > pencil icon > Version: New version > Deploy) so the URL stays the same.
