# Employee activity monitoring

This implementation extends the existing Employee, User, Task and JWT flows. It does not replace the existing CRM. Employee login opens/reuses attendance for a linked, non-resigned employee; explicit check-in uses the same lifecycle. Login alone never starts collection. The employee attendance controls are at `/employee-activity`; administrators use `/monitoring`. Admin logout popups appear throughout the main admin layout.

## Run locally

MongoDB **must run as a replica set** (MongoDB 7+ recommended). Work-session updates, event ingestion and notification creation use transactions to prevent collection/finalization races. A standalone MongoDB server cannot execute these operations.

1. Start a local replica set, using your installed MongoDB:
   ```sh
   mkdir -p /private/tmp/northpoint-mongo
   mongod --replSet rs0 --bind_ip 127.0.0.1 --dbpath /private/tmp/northpoint-mongo
   ```
   In another terminal:
   ```sh
   mongosh --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"127.0.0.1:27017"}]})'
   ```
   For an existing database, configure replication without deleting its data. Atlas replica sets also work.
2. Configure backend `.env` from `backend/.env.example` (preserve any existing configuration). Set `MONGODB_URI` to your replica-set URI and choose a random JWT secret. Then:
   ```sh
   cd backend
   npm ci
   npm run dev
   ```
3. In another terminal:
   ```sh
   cd frontend
   npm ci
   npm run dev
   ```
   Frontend defaults to `http://localhost:5173`; the API defaults to port 5001. Optional `frontend/.env` uses `VITE_API_URL` from `.env.example`.
4. Use your existing admin and employee accounts. The employee must have an Employee record whose `user` references their User ID. Existing usernames are employee codes; the database ID is the fallback. Resigned employees cannot start sessions. Log in as an admin in one browser and an employee in another. Employee: open `/employee-activity`, check in, update a task, then check out. Admin: observe the finalized popup and open the exact employee/session report.

Desktop and browser-extension tracking have been removed. Employees use Northpoint for check-in/check-out, unpaid breaks, and task updates. No new application, website, or active/idle events are collected. Historical monitoring records and summaries remain readable under the existing access rules and retention policies.

## Supported workflows

- Employees: `/employee-activity` for attendance, breaks, historical reports, correction requests, and withdrawal of earlier monitoring consent; `/employee-tasks` for task updates.
- Administrators: `/monitoring` for attendance reports, historical activity, exports, and logout notifications.
- Check-in/check-out, authenticated logout, notifications, and task completion snapshots continue to work.
- Existing monitoring sessions can be paused or stopped, and earlier consent can be withdrawn. New consent, monitoring start/resume, and activity event uploads return HTTP 410. Previously installed tracking clients cannot upload new events.

## Run checks

```sh
cd frontend
npm run build
```

MongoDB must run as a replica set for attendance finalization and notification transactions. Configure the backend and frontend using their existing `.env.example` files. Existing raw activity records expire according to `ACTIVITY_RETENTION_DAYS`; historical summaries remain available. This change does not delete employee history.
