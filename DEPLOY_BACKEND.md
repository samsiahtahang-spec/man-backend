Render deployment (quick guide)

1. Push your repo to GitHub.
2. Create a free account at https://render.com and connect your GitHub.
3. Create a new Web Service and select the repository and branch.
   - For Environment, choose "Node".
   - Build Command: leave blank or `npm ci`.
   - Start Command: `node server.js`.
   - Port: Render provides via env var; your `server.js` uses `process.env.PORT || 4000`.
4. Deploy. After deployment you'll get a URL like `https://your-backend.onrender.com`.
5. Update the frontend to use that backend:
   - Create a file `.env` in the project root with:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```
   - Build the frontend and deploy to Firebase Hosting:
     ```bash
     npm run build
     npx firebase deploy --only hosting
     ```

Notes:
- The `.env` file is read at build time by Vite. Make sure to rebuild the frontend after changing `VITE_API_URL`.
- If you prefer Docker, Render supports deploying Docker directly using the provided `Dockerfile`.
