# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend

The backend is set up with Express and MongoDB using a controller, route, and model structure.

Configure MongoDB and the API port in the root `.env` using `.env.example`. Start both the frontend and backend together with:

```bash
npm run dev
```

Keep this terminal running. The command reuses a backend already listening on the configured port; otherwise it starts one. To run only the frontend, use `npm run dev:frontend`.

To run only the backend:

```bash
npm run server
```

The frontend axios client uses `VITE_API_URL`. Create `.env` from `.env.example` if you need to change the API base URL.

Available API resources:

- `GET /api/health`
- `/api/employees`
- `/api/clients`
- `/api/projects`
- `/api/tasks`

Each resource supports `GET /`, `POST /`, `GET /:id`, `PUT /:id`, and `DELETE /:id`.

## Temporary development logins

Run `npm run seed:temp-logins` to create these accounts in the configured database. Running it again preserves matching accounts and never resets existing credentials.

| Role | Username | Email | Password |
| --- | --- | --- | --- |
| Admin | tempadmin | temp.admin@northpoint.test | NorthpointAdmin!2026 |
| Employee | tempemployee | temp.employee@northpoint.test | NorthpointEmployee!2026 |

Log in at `/login` using the username or email. The employee also has a linked profile so administrators can assign projects and tasks. These accounts are for temporary development use; remove them when finished.

The API uses port 5001 (`http://localhost:5001/api`) to avoid the macOS AirPlay/Control Center service on port 5000. Restart Vite after changing `.env`.
