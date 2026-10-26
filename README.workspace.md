# Workspace pages

All previously unmatched navigation destinations now have pages in the existing React app. The pages share the neutral gray navigation theme and use saved MongoDB records, with loading, empty and error states.

## Pages

| Route | Function |
| --- | --- |
| `/reports` | Attendance/activity reports plus project/task tables and JSON export |
| `/settings`, `/employee-settings`, `/client/settings` | Saved appearance/timezone preferences and authenticated account details |
| `/notifications`, `/employee-notifications`, `/client/notifications` | Scoped updates with persisted read state and filtering |
| `/client/Notification` | Compatibility route to the new notification center |
| `/employee-documents` | Only documents explicitly assigned to the signed-in account; preview/download/print |
| `/documents/new/:type` | Reuses the existing HR editor for offer letters, internship letters and quotations |
| `/documents` | Admin distribution of saved HR documents to a linked employee account |
| `/help-desk`, `/employee-help-desk`, `/client/help-desk` | Persisted requests and replies; administrators can update status |
| Unmatched routes | Not-found page with a valid dashboard/sign-in link |

The existing employee/client sidebar links now work. The client Help & Support button is connected; document distribution and employee support have navigation entries. The existing sample support page is replaced at `/help-desk` by real tickets.

## APIs

All `/api/workspace` routes require the existing Bearer authentication and are rate limited.

- `GET /settings`, `PATCH /settings`: own account; PATCH accepts `theme` (`light`/`dark`) and a valid IANA `timezone`. Identity and role cannot be changed here.
- `GET /notifications`, `PATCH /notifications/read`: own notification feed/read state; body `{ids:[...]}`. Admins see persisted logout notifications and support updates; employees see their attendance, assigned-task and support updates; clients see linked-project and support updates. Derived update IDs include the record update timestamp so later updates become unread.
- `GET /reports/tasks`, `GET /reports/projects`: admin/superadmin only; latest 1000 summary records.
- `GET /documents`: explicitly assigned HR documents only.
- `GET /document-management`: admin-only saved HR documents (latest 500) and linked employee identity options, excluding generated credentials.
- `PATCH /documents/:id/recipient`: admin-only explicit sharing/unsharing; body `{recipient:userId}` or `{recipient:null}`. Writes an audit record.
- `GET /support`: paginated tickets (20 per page), with `page`, `search` (subject) and `status`. Employees/clients see only their tickets; admins/superadmins see all.
- `POST /support`: `{subject,description,category,priority}`; requester is always selected by the server.
- `PATCH /support/:id`: ticket-owner/admin replies via `{message}`; only admins may change `{status}`.

User gains `preferences` and bounded `notificationReadIds`; HrDocument gains an indexed `recipient`; SupportTicket stores requester, category, priority, status and reply history. Existing HR records are not automatically shared by matching a name or email. Use Document distribution to share a saved document explicitly.

## Run and validate

Use the existing backend/frontend environment configuration:

```sh
cd backend
npm run dev
```

In another terminal:

```sh
cd frontend
npm run dev
```

Backend watch mode loads the new routes automatically. Open the routes above while signed in with the appropriate role. Preview mode does not fabricate saved records; pages display API errors without a real account.

Verification commands:

```sh
cd frontend
npx eslint src/Pages/Settings.jsx src/Pages/NotificationCenter.jsx src/Pages/Reports.jsx src/Pages/DocumentLibrary.jsx src/Pages/SupportDesk.jsx src/Pages/NotFound.jsx src/Components/WorkspacePage.jsx
npm run build
```


## Verified results and files

- ESLint: new workspace pages and changed navigation components passed.
- Frontend production build: passed; existing large-bundle warning remains.
- Live local backend: new settings, support and document endpoints require authentication (401), confirming they are mounted rather than missing (404).

Added frontend files: `Pages/Reports.jsx`, `Settings.jsx`, `NotificationCenter.jsx`, `DocumentLibrary.jsx`, `DocumentEditor.jsx`, `SupportDesk.jsx`, `NotFound.jsx`, `Components/WorkspacePage.jsx`, and `workspace.css`. Updated `App.jsx`, `Pages/HrDocuments.jsx`, the admin/employee/client sidebars and `Components/ActivityNotifications.jsx`.

Added backend files: `models/SupportTicket.js`, `routes/workspaceRoutes.js`. Updated `app.js`, `models/User.js`, and `models/HrDocument.js`. No new environment variables are needed.
