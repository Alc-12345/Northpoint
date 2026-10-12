# Northpoint Backend

From the repository root:

```bash
npm --prefix backend install
npm --prefix backend start
```

Configuration loads from `backend/.env`. The API uses port 5001. Shared frontend/backend utilities live in `backend/shared/`.

Run tests with `npm --prefix backend test` and prepare test accounts with `npm --prefix backend run seed:temp-logins`.
