# Bug Tracker / Issue Tracker

A MERN-stack team project management application based on the supplied 14-day PDF plan.

## Stack
- React + Vite + Tailwind CSS
- React Router, Fetch API, dnd-kit
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + bcryptjs
- Multer screenshot attachments
- Helmet + CORS + dotenv

## Features
- Register/login with JWT authentication
- Create, list, update and delete projects
- Add/remove project members
- Create, edit, delete, assign and filter tickets
- Kanban board with drag-and-drop status changes
- Ticket comments
- Role-aware project access (Admin, Manager, Developer, Viewer)
- Optional screenshot uploads
- Responsive dashboard, search and priority/status filters

## Requirements
Node.js 20+ and MongoDB Atlas (or local MongoDB).

## Run locally

### 1. Backend
```bash
cd server
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```
Backend runs at `http://localhost:8080`.

### 2. Frontend
In a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

Register the first account. The first registered user becomes an application admin. Create a project and add team members by their registered email addresses.

## Deployment
### Render (backend)
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables from `server/.env.example`.
- Set `CLIENT_ORIGIN` to your deployed Vercel URL.
- Persistent disk is recommended if using local Multer uploads. For production scale, replace local uploads with object storage.

### Vercel (frontend)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your Render API URL, e.g. `https://your-api.onrender.com/api`.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/:id`
- `POST /api/projects/:id/members`, `DELETE /api/projects/:id/members/:userId`
- `GET/POST /api/tickets`, `GET/PUT/DELETE /api/tickets/:id`
- `POST /api/tickets/:id/comments`, `GET /api/tickets/:id/comments`
- `GET /api/health`

All protected endpoints require `Authorization: Bearer <token>`.

## Notes
- This is a complete starter/MVP, not a hosted live service. Configure secrets and test your deployment before using real team data.
- Uploads are stored in `server/uploads`; do not commit real user attachments.
