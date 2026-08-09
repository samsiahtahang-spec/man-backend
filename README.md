# Manz App

A React + Vite frontend with an Express + SQLite backend for register/login authentication.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the backend locally:

```bash
npm run backend
```

3. Start the frontend locally:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:5173
```

The frontend uses `VITE_API_URL` from a `.env` file at build time, and otherwise defaults to `http://localhost:4000`.

## Deployment overview

This project must be deployed in two parts:

1. **Backend:** a public Node server running `server.js`.
2. **Frontend:** static files hosted by Firebase Hosting.

### Why Firebase Hosting alone is not enough

`firebase deploy --only hosting` only uploads frontend files. It does not run your Express backend or host the SQLite database.

Your backend must be hosted separately on a service like Render, Railway, or Fly.io.

## Recommended deployment path

### 1. Deploy the backend

A simple free option is Render:

1. Push the repository to GitHub.
2. Sign in to https://render.com and connect your GitHub repo.
3. Create a new Web Service with these settings:
   - Environment: `Node`
   - Build Command: `npm ci`
   - Start Command: `node server.js`
   - Port: leave default (Render provides `PORT`)
4. Deploy and copy the generated public URL.

Other options that also work:
- Railway: https://railway.app
- Fly.io: https://fly.io
- DigitalOcean App Platform

### 2. Point the frontend to the hosted backend

Create a `.env` file in the project root with the backend URL:

```env
VITE_API_URL=https://your-backend.onrender.com
```

Then rebuild the frontend.

### 3. Deploy the frontend to Firebase

Run:

```bash
npm run build
npx firebase deploy --only hosting
```

Or use the existing npm script:

```bash
npm run deploy
```

### 4. Verify everything

- Backend health check:
  - `https://your-backend.onrender.com/api/health`
- Frontend app should work on other devices using the Firebase Hosting URL.

## Important notes

- Use the backend URL from your host in `.env` before building the frontend.
- `localhost:4000` works only on your own machine, not on another phone or device.
- If you change `VITE_API_URL`, rebuild the frontend before deploying.

## Existing repository files

- `server.js` — Express backend with `/api/register`, `/api/login`, `/api/health`
- `vite.config.js` — development proxy from `/api` to `http://localhost:4000`
- `firebase.json` — Firebase Hosting config
- `.env.example` — example backend URL configuration
- `Dockerfile` — optional backend container definition

## Useful commands

- `npm run dev` — run the frontend locally
- `npm run backend` — run the backend locally
- `npm run build` — build the frontend
- `npm run deploy` — build frontend and deploy Firebase Hosting
