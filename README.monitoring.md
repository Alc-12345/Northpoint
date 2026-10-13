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
4. Use your existing admin and employee accounts. The employee must have an Employee record whose `user` references their User ID. Existing usernames are employee codes; the database ID is the fallback. Resigned employees cannot start sessions. Log in as an admin in one browser and an employee in another. Employee: open `/employee-activity`, check in, accept the policy, enable monitoring, then check out. Admin: observe the finalized popup and open the exact employee/session report.
5. Optional desktop agent:
   ```sh
   cd desktop
   npm ci
   npm start
   ```
   Sign in using the same employee account, check in if necessary, accept the visible policy and enable collection. Collection is always off after restart. Stop/pause/check-out/logout first stop the local timer, flush previously authorized events where possible, then finalize on the server. A failed flush leaves collection off.
6. Optional Chrome/Edge extension: open `chrome://extensions` (or Edge extensions), enable Developer mode and load the `browser-extension` directory. Open its popup and explicitly authorize website categories. Check in before enabling. The extension observes only the currently focused tab, classifies its domain locally and sends category intervals. It never uploads URLs, query strings, page contents or history. Credentials stay in worker memory. A worker restart or socket disconnect stops collection and requires explicit re-enabling. Review/restrict manifest host permissions to your production API before distribution.

Production requires HTTPS via your reverse proxy, HTTPS frontend/API URLs, a strong JWT secret, and an appropriately configured MongoDB replica set. Socket.IO must be proxied with WebSocket support. This version supports a single API process; multiple instances need a Socket.IO shared adapter and distributed rate limiting/outbox claims.

## Environment variables

| Variable | Default / purpose |
| --- | --- |
| `PORT` | `5001`, API port |
| `MONGODB_URI` | Replica-set MongoDB URI; example includes `replicaSet=rs0` |
| `CLIENT_URL` | `http://localhost:5173`, allowed browser and Socket.IO origin |
| `JWT_SECRET` | Configure a random secret; production startup requires at least 32 characters |
| `JWT_EXPIRES_IN` | Existing default `7d`; example recommends `8h` |
| `SUPERADMIN_REGISTER_KEY` | Existing account setup key |
| `MONITORING_POLICY_VERSION` | `1`; the visible client policy must be updated when changing this value |
| `ACTIVITY_RETENTION_DAYS` | `90`, raw activity expiry |
| `VITE_API_URL` | `http://localhost:5001/api`, frontend API and Socket.IO base |

## APIs

All added endpoints require Bearer authentication and are rate limited. Admin routes allow only `admin`/`superadmin`; other roles, including managers without an implemented scope model, are denied. Employee session IDs are always checked against their linked Employee record.

| Method | Endpoint | Behavior |
| --- | --- | --- |
| POST | `/api/auth/logout` | Finalize employee attendance, notify admins, revoke existing account tokens |
| POST | `/api/attendance/check-in` | Idempotently create/reuse an open work session; body `timezone` |
| POST | `/api/attendance/check-out` | Finalize attendance and monitoring; optional `sessionId` for exact retry |
| POST | `/api/attendance/breaks` | Server-timed unpaid break; body `action: start/end` |
| GET | `/api/attendance/me/today` | Today’s sessions in their recorded timezone, plus open overnight attendance (up to ten) |
| POST | `/api/monitoring/consent` | Explicit policy acceptance and scope, or `{withdraw:true}` |
| POST | `/api/monitoring/sessions/start` | Start with accepted consent; optional `os`, `agentVersion` |
| POST | `/api/monitoring/sessions/pause` | Close active collection interval; attendance stays open |
| POST | `/api/monitoring/sessions/resume` | Explicitly resume an authorized session |
| POST | `/api/monitoring/sessions/stop` | End monitoring only |
| POST | `/api/monitoring/events/batch` | `monitoringSessionId`, up to 200 approved events |
| GET | `/api/monitoring/me/activity` | Employee's latest 31 session reports |
| POST | `/api/monitoring/me/corrections` | `sessionId`, `reason`; audited correction/offline note request |
| GET | `/api/admin/monitoring/overview` | Current counts and completed UTC day/week/month aggregates (`period`) |
| GET | `/api/admin/monitoring/reports` | Paged reports; `page`, `employee`, `from`, `to`, `status`, `department`, `agentStatus`, `category` |
| GET | `/api/admin/monitoring/employees/:employeeId` | Individual employee reports |
| GET | `/api/admin/monitoring/export` | Audited admin JSON export of latest 1000 completed sessions |
| DELETE | `/api/admin/monitoring/employees/:employeeId/data` | Superadmin-only activity deletion; requires reason and no open attendance |
| GET | `/api/admin/notifications` | Recipient's latest 100 notifications and unread count |
| PATCH | `/api/admin/notifications/:id/read` | Recipient-only read acknowledgement |
| GET | `/api/tasks/me` | Existing assigned Task records using ID/username/email |
| PATCH | `/api/tasks/:id` | Own assigned task status; records history/completion timestamp |

Existing task APIs now require authentication; create/edit/delete require admin privileges. Employees retain the existing hours/work-note endpoint. No duplicate EmployeeTask collection is created. Task completion snapshots appear in finalized work reports. Existing assignment strings should use unique employee ID, username or email; name-only legacy assignments should be migrated before using `/tasks/me` or status PATCH.

Activity event fields: unique `key`, `type` (`active`, `idle`, `application`, `website`), UTC `start`/`end`, `source` (`desktop`, `extension`), and optional approved `application`/`category`. Website categories are restricted to development, communication, business, research, uncategorized; no URL field is persisted. Stopped/paused/withdrawn/closed sessions reject uploads, even if the events describe earlier time. Desktop controls therefore flush *before* server finalization where possible. Failed pending uploads are never used to fabricate data.

## Data, calculations and notifications

- `WorkSession`: one open session per employee, UTC timestamps, display timezone, server-timed unpaid breaks, finalized summary.
- `MonitoringSession`: distinct authorization intervals, pauses, consent, platform/version, heartbeat, expiry and agent status. A 15-second recovery job pauses stale desktop agents at their last heartbeat after 60 seconds without contact; it does not check out attendance. Expired authorization stops monitoring separately.
- `ActivityEvent`: unique `(monitoringSession,key)`, indexes and TTL `expiresAt`; replay never increases recorded duration.
- `ActivitySummary`: one persisted summary per finalized work session. Raw event expiry does not erase the finalized summary.
- `MonitoringConsent`: explicit policy/scope/acceptance/withdrawal. Withdrawal closes collection intervals transactionally.
- `AdminNotification`: unique recipient + work-session logout key; notifications and summary commit together. Notification history has a 365-day MongoDB TTL.
- `AuditLog`: correction requests, exports, administrative deletions. Audit records and attendance/summary/consent records are retained until an explicit approved deletion policy is applied. The deletion endpoint removes activity/attendance/consent/notifications while preserving its audit reason, Employee and Task records.
- Existing User gains token version revocation; Task gains completion/update history. Logout revokes all account tokens, rather than providing per-device revocation or refresh-token rotation.

Mongoose creates indexes for these models when used; deploy indexes through your normal MongoDB migration process if production disables automatic indexing. Ensure unique indexes are built before accepting concurrent attendance/event uploads.

Attendance subtracts the union of unpaid break intervals from UTC elapsed attendance. Monitoring uses the union of collection intervals clipped to attendance. Active/idle signals are merged independently; their conflicting overlap is classified unknown. Gaps remain unclassified. Per-application/category overlaps with conflicting labels become unknown instead of double-counting. These values are observations and are never labelled productive hours. Daily/weekly/monthly totals group completed sessions by UTC check-in period; overnight sessions are kept intact, not split across calendar days.

The internal `employee:logout` event occurs after the transaction commits. Authenticated sockets join only server-selected `user:<id>` rooms. Admin recipients receive `admin:employee-logout`, `admin:notification`, and unread `admin:notification-count`. Session controls send `monitoring:session-updated` to the linked employee. Notifications are persisted before delivery, recovered by a polling outbox worker, and deduplicated by ID in the UI. Database history is the recovery source for disconnected/offline admins. Socket delivery is at least once; an emitted packet is not a browser acknowledgement. Admin dashboards fetch history on reconnect and every 30 seconds.

## Platform collectors and limits

The desktop agent records idle/active signals via Electron's OS idle API. macOS foreground application names use System Events/osascript; Windows uses foreground HWND + process name through PowerShell. Names are sampled approximately every five seconds without window titles or content. macOS Automation denial and process-access failures are visible; collection does not bypass permissions. Application observations are unknown when unavailable. Chrome/Edge website-category collection is optional; Safari and Firefox extensions are not supplied. No GitHub commit integration is supplied.

The queue uses Electron safeStorage encryption, contains only approved metadata, and expires after one hour. If secure storage is unavailable, offline queueing is disabled. Network/auth/socket failures stop local collection. A crash/suspend/browser closure does not imply explicit logout. Browser logout stops connected agents through the server session update; server boundaries also reject later uploads. Devices cannot auto-resume after application restart. Missing checkout remains an open attendance record requiring employee/admin follow-up.

Correction requests are stored as audit records; a separate admin adjudication workflow is not supplied. The UI includes error/loading/empty states and paged employee reports. Department and agent/category filters apply to reports. Export is restricted and audited. Notification history shows the latest 100; older records remain in MongoDB until TTL expiry. Native permission checks are unit-tested with denied collector calls; interactive permission prompts and real Windows process collection still require platform smoke tests. Installers are unsigned; production needs macOS signing/notarization and Windows signing credentials. No per-device management/refresh-token rotation, multi-process Socket.IO adapter, or browser-extension distribution pipeline is implemented.

## Validation and packaging

```sh
cd backend
npm test
cd ../frontend
npm run build
cd ../desktop
npm test
npm run pack:mac
npm run pack:win
```

Backend tests include transaction-backed MongoDB replica-set integration tests, consent withdrawal, cross-employee rejection, stopped-session rejection, duplicate uploads/checkouts, persisted offline notifications, and live Socket.IO admin-only delivery. Duration tests cover overlaps, conflicts, missing data, unpaid breaks and overnight sessions. Desktop tests cover queue authorization/restart/expiry and native collector permission-denial handling. The backend suite also retains the existing CRM tests; obsolete Mongoose connection options and Jest assertions in Node tests were repaired.

Installer output: `desktop/dist/northpoint-monitor-1.0.0.dmg` and `desktop/dist/northpoint-monitor Setup 1.0.0.exe`. Packaging does not prove interactive OS permissions/runtime behavior. Current platform smoke tests must be run on Windows and macOS before distribution. Desktop packaging tooling currently has moderate npm audit findings; production dependency audit and signing are separate release checks.

## Changed files for this feature

- Backend: `app.js`, `controllers/authController.js`, `controllers/taskController.js`, `middleware/authMiddleware.js`, `models/User.js`, `models/Task.js`, new `models/Monitoring.js`, `routes/authRoutes.js`, `routes/taskRoutes.js`, new `routes/monitoringRoutes.js`, new `services/monitoring.js`, `services/monitoringSocket.js`, `services/activityDurations.js`, package manifests, `.env.example`.
- Tests: new `tests/monitoring.test.js`, `tests/activity-durations.test.js`; compatibility/security adjustments in `tests/auth.test.js`, `tests/employee.test.js`, `tests/hr-project.test.js`, `tests/task-etl.test.js`.
- Frontend: `src/App.jsx`, `src/Layout/MainLayout.jsx`, `src/Layout/EmployeeLayout.jsx`, `src/utils/auth.js`, `src/services/api.js`, new `src/Components/ActivityNotifications.jsx`, new `src/Pages/Monitoring.jsx`, `.env.example`; regenerated production build.
- Desktop: `package.json`, lockfile, `main.js`, `preload.cjs`, `renderer.js`, `index.html`, `collector.js`, `foreground.js`, `tests/collector.test.js`.
- Extension: `manifest.json`, `popup.html`, `popup.js`, `worker.js`, vendored Socket.IO browser module and license.
- Root: `.gitignore`, this README. Other pre-existing working-tree changes were preserved.
