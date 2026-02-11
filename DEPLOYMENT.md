# Brainly Deployment Guide

This guide details how to deploy your **Brainly** application.

## 1. Push Code to GitHub
1.  Create a **new empty repository** on GitHub (do not initialize with README/gitignore).
2.  Run these commands in your project root terminal:
    ```bash
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin master
    ```

## 2. Deploy Backend (Render)
1.  Log in to [Render](https://render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the settings:
    - **Name**: `brainly-api`
    - **Region**: Closest to you (e.g., Singapore)
    - **Branch**: `master`
    - **Root Directory**: `Server` (Important, case-sensitive on Linux hosts)
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start` (runs `prestart` preflight checks automatically)
    - **Plan**: Free
5.  **Environment Variables** (Add these under "Advanced" or "Environment"):
    - Use `Server/.env.production.example` as the source template.
    - `NODE_ENV`: `production`
    - `PORT`: Leave unset on Render unless you have a custom requirement (Render injects this automatically).
    - `CORS_ORIGINS`: Comma-separated frontend URLs (production-only domains in production).
    - `MONGODB_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A random secret with at least 32 characters.
6.  Click **Create Web Service**.
7.  **Copy the URL** provided by Render (e.g., `https://brainly-api.onrender.com`).

## Backend Preflight Checks
- `npm run preflight` validates required env vars and basic production safety rules.
- `npm start` runs preflight automatically (via `prestart`) before booting the server.
- If preflight fails, deployment/startup exits early with actionable errors.

## 3. Deploy Frontend (Vercel)
1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the settings:
    - **Framework Preset**: Vite (should auto-detect).
    - **Root Directory**: `./` (Default is fine).
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
5.  **Environment Variables**:
    - `VITE_BACKEND_URL`: Paste the **Render backend URL** from step 2 (without trailing slash and without `/api/v1`, e.g., `https://brainly-api.onrender.com`).
6.  Click **Deploy**.

## 4. Final Configuration
Ensure your local code calls the correct backend URL using `import.meta.env.VITE_BACKEND_URL`.
