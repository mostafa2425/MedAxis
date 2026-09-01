# MedAxis Admin Portal

Separate React/Vite admin frontend for MedAxis. It uses the shared MedAxis API and relies on server-side JWT authentication plus the `admin` role.

## Local development

```bash
npm install
npm run dev
```

Set `VITE_API_URL` when the API is hosted separately. For a local API, for example:

```bash
VITE_API_URL=http://localhost:3005/api
```

## Build checks

```bash
npm run typecheck
npm run build
```

## Deployment

For Vercel, create a separate project from this repository and set **Root Directory** to `admin-client`. Configure `VITE_API_URL` to the deployed MedAxis API base URL (including `/api`).

Do not put secrets in this frontend; Vite variables are public at runtime.
