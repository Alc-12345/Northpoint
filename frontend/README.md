# Northpoint Frontend

This folder contains the React frontend, public assets, build configuration, and uses the common utilities in `../shared/`.

```bash
cd frontend
npm ci
npm run dev
```

Start the backend in a separate terminal from the repository root:

```bash
npm run server
```

The frontend connects to `http://localhost:5001/api`. Set `VITE_API_URL` in `.env` to change it, then restart Vite. Only frontend environment variables are copied into this folder.

Build for production with `npm run build`; output is written to `frontend/dist`.
