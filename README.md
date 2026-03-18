# Brainly

Brainly is a "second brain" full-stack application built for saving, organizing, and sharing links and digital content.

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS.
- **Backend**: Node.js, Express 5, TypeScript. 
- **Database**: MongoDB (managed via Mongoose).
- **Authentication**: Clerk (Frontend session management + Backend token verification).

## 🧠 The Workflow

Here is how the distinct pieces of the stack talk to each other:

1. **Authentication**: Users sign up or log in via the Clerk React SDK. Clerk securely handles the heavy lifting of session state and issues an authentication token.
2. **Frontend Requests**: The React app uses Axios to communicate with the backend. An Axios interceptor automatically grabs the latest Clerk token and attaches it to the `Authorization` header of every outgoing request.
3. **Backend Validation**: The Express server receives the request on `/api/v1/*`. Protected routes run through Clerk's Express middleware, which validates the JWT token and extracts the user's secure ID.
4. **Database Operations**: With the user's identity confirmed, the backend uses Mongoose to interact with MongoDB. It performs CRUD operations (creating, fetching, or deleting content), ensuring users can only access data tied to their specific ID.
5. **Public Sharing**: Users can generate a unique `shareId` to publish their "brain". When someone visits a shared link, the frontend hits a designated public route (`GET /brain/:shareId`). The backend bypasses authentication for this specific endpoint and returns the read-only data associated with that hash.

## 🚀 Running Locally

You'll need Node.js 20+, npm, and a MongoDB instance (local or Atlas).

**1. Install dependencies**
```bash
npm install              # Frontend deps
cd Server && npm install # Backend deps
```

**2. Configure Environment Variables**

Create a `.env` in the **root** folder:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Create a `.env` in the **`Server/`** folder:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CORS_ORIGINS=http://localhost:5173
```

**3. Start the application**
```bash
npm run dev
```
This commands runs `concurrently`, spinning up both the Vite frontend (`localhost:5173`) and the Nodemon backend server (`localhost:4000`) simultaneously.

## 📦 Production Notes

- **Frontend Build**: Run `npm run build` to compile the Vite application into static production assets.
- **Backend Build**: Navigate to `Server/` and run `npm run build` to transpile TypeScript into `Server/dist`.
- **Preflight Checks**: The backend utilizes a `npm run preflight` script. When you run `npm start` in production, it automatically verifies that critical environment variables exist before booting up the Express server.

---
**Author**: Ashwin Chaudhary
