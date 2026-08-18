# 🧠 Brainly — Your Second Brain

A full-stack knowledge management platform to quickly capture, organize, preview, and share links, videos, tweets, notes, and digital content in a glassmorphic dark-mode workspace.

---

## ✨ Features

- **⚡ Quick Capture Bar** — Auto-detects content type (YouTube, Twitter/X, Instagram, Audio, Images, Articles) and saves with a single keystroke.
- **🖼️ Rich Media Embeds** — Native previews for YouTube videos, Tweets, Instagram posts, HTML5 audio tracks, and images.
- **🏷️ Smart Filtering & Tags** — Organize items by tags and filter by content type (All, Tweets, Videos, Documents, Links, Audio, Images).
- **🔗 Shareable Brain Links** — Generate a public read-only link (`/share/:shareId`) to share your knowledge collection with anyone.
- **🔐 Dual Authentication** — Secure Email + Password authentication (JWT & bcrypt) alongside Google OAuth.
- **🎨 Glassmorphic UI** — High-performance dark aesthetic powered by Tailwind CSS v4, Framer Motion, and custom Geist typography.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS v4, Framer Motion, React Router 7 |
| **Backend** | Node.js, Express 5, TypeScript, JWT, bcryptjs, Google Auth Library |
| **Database** | MongoDB & Mongoose |
| **Auth** | JWT (Local) + Google OAuth (`@react-oauth/google`) |

---

## 📁 Project Structure

```text
Brainly/
├── src/                      # Frontend Application (React 19 + Vite)
│   ├── api/                  # Axios API clients (auth, brain, content)
│   ├── assets/               # Brand assets & Geist fonts
│   ├── components/
│   │   ├── common/           # Reusable UI (Button, ConfirmationModal)
│   │   ├── core/             # Navbar, ContentCard, QuickCapture, ContentEmbed
│   │   ├── pages/            # Home, SignIn, SignUp, SharedBrain
│   │   └── ui/               # CustomSelect, animated components
│   ├── context/              # AuthContext & Session management
│   ├── types/                # TypeScript interfaces
│   └── utils/                # URL parsers & metadata helpers
├── Server/                   # Backend Application (Express 5 + TypeScript)
│   ├── src/
│   │   ├── config/           # Database connection & DNS resolver
│   │   ├── middleware/       # JWT auth verification
│   │   ├── models/           # Mongoose schemas (User, Content, Brain)
│   │   ├── routes/           # /api/v1/user, /content, /brain
│   │   └── index.ts          # Server entry point
│   └── scripts/              # Preflight configuration checks
└── package.json              # Workspace root scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+ and **npm**
- **MongoDB** instance (local or MongoDB Atlas connection string)
- *(Optional)* Google OAuth Client ID for Google Sign-In

---

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/AshwinD40/Brainly.git
cd Brainly

# Install frontend dependencies
npm install

# Install backend dependencies
cd Server && npm install
cd ..
```

---

### 2. Configure Environment Variables

Create a `.env` file in the **root** folder:

```env
# Frontend
VITE_BACKEND_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Create a `.env` file in the **`Server/`** folder:

```env
# Backend
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/brainly
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id
CORS_ORIGINS=http://localhost:5173
```

---

### 3. Run Locally

From the root directory, start both the client and server concurrently:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/v1/user/signup` | Register a new user | No |
| `POST` | `/api/v1/user/signin` | Sign in with email & password | No |
| `POST` | `/api/v1/user/google` | Sign in / sign up with Google | No |
| `GET` | `/api/v1/user/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/v1/content` | Fetch all saved user items | Yes |
| `POST` | `/api/v1/content` | Create new content item | Yes |
| `DELETE` | `/api/v1/content/:id`| Delete a content item | Yes |
| `POST` | `/api/v1/brain/share` | Enable/disable public brain sharing | Yes |
| `GET` | `/api/v1/brain/:shareId`| Public access to shared brain | No |

---

## 📦 Build for Production

```bash
# Build frontend bundle (outputs to /dist)
npm run build

# Build backend (outputs to /Server/dist)
cd Server && npm run build
```

---

## 👤 Author

**Ashwin Chaudhary**
- GitHub: [@AshwinD40](https://github.com/AshwinD40)
