# Northpoint Deployment Guide (Netlify + Render + CI/CD)

This guide provides step-by-step instructions to deploy the **Northpoint** full-stack application:
- **Frontend**: Deployed on [Netlify](https://www.netlify.com/)
- **Backend**: Deployed on [Render](https://render.com/)
- **Database**: Cloud [MongoDB Atlas](https://www.mongodb.com/atlas) (Free Tier M0)
- **CI/CD**: Automated testing & build checks via **GitHub Actions** (`.github/workflows/ci.yml`)

---

## 1. Quick Summary of Configuration Files Created

| File | Purpose |
|---|---|
| `netlify.toml` | Root Netlify configuration: sets `frontend` as base, `npm run build`, publish dir `dist`, and SPA routing. |
| `frontend/public/_redirects` | Fallback SPA routing rule (`/* /index.html 200`) so refreshing any page on Netlify never returns 404. |
| `render.yaml` | Render Blueprint: automates creating backend Web Service, health check (`/api/health`), and environment variable setup. |
| `.github/workflows/ci.yml` | GitHub Actions CI workflow: runs backend tests (Node 20) and validates frontend build on push/PR. |
| `.gitignore` | Updated monorepo gitignore to prevent committing `node_modules`, `.env`, and `dist` build folders. |

---

## 2. Prerequisites

1. **GitHub Repository**: Push your code to your GitHub repo:
   ```bash
   git add .
   git commit -m "feat: setup netlify, render and github actions ci/cd"
   git push origin main
   ```
2. **MongoDB Atlas Account**: Ensure you have an active MongoDB Atlas cluster with Network Access allowed from `0.0.0.0/0` (Render IPs are dynamic).

---

## 3. Backend Deployment on Render

### Option A: Using Render Blueprints (Recommended - 1 Click)
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Blueprint**.
3. Select your `Northpoint` repository.
4. Render will detect `render.yaml`:
   - It will automatically set runtime to **Node**, root dir to `backend`, build command to `npm install`, and start command to `npm start`.
   - It will automatically generate secure random keys for `JWT_SECRET` and `SUPERADMIN_REGISTER_KEY`.
5. Under environment variables prompt:
   - **`MONGODB_URI`**: Paste your MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster0.xxx.mongodb.net/northpoint-crm?retryWrites=true&w=majority`).
   - **`CLIENT_URL`**: Enter your temporary or planned Netlify domain (e.g. `https://northpoint.netlify.app`, or `http://localhost:5173` if Netlify URL is not yet ready; you can update it right after deploying Netlify).
6. Click **Apply**.
7. Note down your backend URL (e.g. `https://northpoint-backend.onrender.com`).

### Option B: Manual Web Service on Render
If you prefer creating manually without Blueprint:
- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (Render default)
  - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
  - `CLIENT_URL`: `https://your-site.netlify.app`
  - `JWT_SECRET`: `<Random 32+ characters secret>`
  - `SUPERADMIN_REGISTER_KEY`: `<Your secret superadmin key>`
  - `JWT_EXPIRES_IN`: `8h`
  - `MONITORING_POLICY_VERSION`: `1`
  - `ACTIVITY_RETENTION_DAYS`: `90`

---

## 4. Frontend Deployment on Netlify

1. Log in to [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and authorize your `Northpoint` repo.
4. Netlify will automatically detect `netlify.toml`:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (or `dist`)
5. Under **Environment variables**, click **Add a variable**:
   - Key: `VITE_API_URL`
   - Value: `https://<your-backend-app-name>.onrender.com/api` *(Make sure to include `/api` at the end)*
6. Click **Deploy Northpoint**.
7. Once deployed, Netlify will provide your live site URL (e.g. `https://northpoint-crm.netlify.app`).

---

## 5. Connect Frontend and Backend (CORS Finalization)

Once Netlify gives you your live URL (e.g. `https://northpoint-crm.netlify.app`):
1. Go back to your Render Dashboard -> Select your `northpoint-backend` service.
2. Go to **Environment** tab.
3. Update `CLIENT_URL` to match your Netlify site URL:
   ```
   CLIENT_URL=https://northpoint-crm.netlify.app
   ```
   *(Note: You can also specify comma-separated URLs if you want both Netlify and local preview: `https://northpoint-crm.netlify.app, http://localhost:5173`)*
4. Click **Save Changes**. Render will automatically redeploy with the updated CORS configuration.

---

## 6. CI/CD Automation

With the `.github/workflows/ci.yml` file in place:
- **On every Pull Request and Push to `main`**:
  - GitHub Actions spins up an Ubuntu environment with Node 20.
  - Installs backend dependencies and runs all 92 unit and integration tests.
  - Installs frontend dependencies, tests utility functions, and runs `npm run build` to verify production assets compile without errors.
- **Continuous Deployment (GitOps)**:
  - Both Netlify and Render are natively wired to your GitHub repository `main` branch.
  - Once your changes pass CI and are merged into `main`, Render auto-deploys the backend, and Netlify auto-deploys the frontend without requiring any manual clicks!

---

## 7. ⚠️ Security Checklist

1. **Rotate MongoDB Credentials**:
   `backend/.env` was previously checked into git containing credentials. Go to MongoDB Atlas:
   - Database Access -> Edit user password -> Create a strong new password.
   - Update Network Access -> IP Access List -> Allow access from anywhere (`0.0.0.0/0`) for Render.
2. **Untrack .env from Git**:
   Run the following command so git stops tracking `.env`:
   ```bash
   git rm --cached backend/.env frontend/.env
   git commit -m "chore: remove sensitive env files from git tracking"
   ```
3. Keep real secrets strictly inside **Render Environment Variables** and **Netlify Environment Variables**.
