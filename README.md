# Brainly

Brainly is a full-stack "second brain" app for saving links, organizing personal knowledge, and sharing a read-only public view of your saved content.

## Features

- User authentication with JWT (`signup`, `signin`)
- Create, view, and delete personal content entries
- Content types support: `youtube`, `twitter`, `instagram`, `article`, `audio`, `video`, `image`, `other`
- Shareable brain link with persistent `shareId`
- Public shared-brain page (read-only)
- Production preflight checks before backend startup

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express 5, TypeScript, MongoDB, Mongoose, JWT
- Tooling: ESLint, Nodemon, TSX, TypeScript compiler

## Project Structure

```text
Brainly/
  src/                  # Frontend source
  public/               # Frontend static assets
  Server/
    src/                # Backend source
    scripts/preflight.mjs
```

## Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended
- MongoDB database (Atlas or self-hosted)

## Environment Variables

### Frontend (`.env` at repo root)

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Backend (`Server/.env`)

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
JWT_SECRET=<strong-secret>
CORS_ORIGINS=http://localhost:5173
```

Notes:

- `VITE_BACKEND_URL` can be set either as `https://host` or `https://host/api/v1`.
- Backend normalizes this automatically on the frontend API client.
- Do not commit real secrets to source control.

## Local Development

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd Server
npm install
cd ..
```

3. Configure `.env` (root) and `Server/.env`.

4. Start frontend + backend together:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Scripts

### Root Scripts

- `npm run dev` - Run frontend and backend in parallel
- `npm run build` - Build frontend production bundle
- `npm run lint` - Run ESLint
- `npm run preview` - Preview built frontend

### Backend Scripts (`Server/`)

- `npm run dev` - Start backend in watch mode (nodemon + tsx)
- `npm run build` - Compile backend TypeScript to `Server/dist`
- `npm run preflight` - Validate production-critical env/runtime checks
- `npm start` - Run preflight, then start backend from `dist/index.js`

## API Overview

Base path: `/api/v1`

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /content/createContent` (auth required)
- `GET /content/user` (auth required)
- `DELETE /content/:id` (auth required)
- `POST /brain/share` (auth required)
- `GET /brain/:shareId` (public)

## Production Notes

- Build backend before startup: `cd Server && npm run build`
- Startup runs preflight automatically: `npm start`
- Set environment variables in your deployment platform (Render/Vercel/etc.)
- Keep `CORS_ORIGINS` restricted to trusted frontend domains

## Author

Ashwin Chaudhary
