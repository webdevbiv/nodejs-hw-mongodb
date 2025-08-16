# Contacts API — HW-07 (Swagger + ReDoc)

Minimal REST API for auth and contacts with file uploads. This branch (`hw7-swagger`) adds API docs via **@redocly/cli** and serves them with **swagger-ui-express**.

## Scripts

- `npm run dev` — start in watch mode
- `npm start` — start
- `npm run preview-docs` — live preview of docs (ReDocly)
- `npm run build-docs` — bundle `docs/openapi.yaml` → `docs/swagger.json`

> Note: `prestart`/`predev` run `build-docs` so `/api-docs` always serves the latest bundle.

## Docs

- **Swagger UI** → `/api-docs`
- **OpenAPI (YAML)** → `/docs/openapi.yaml`
- **OpenAPI (bundled JSON)** → `/docs/swagger.json`

### Local (example)

- Swagger UI: https://contacts-xxm3.onrender.com/api-docs
- YAML: https://contacts-xxm3.onrender.com/docs/openapi.yaml
- JSON: https://contacts-xxm3.onrender.com/docs/swagger.json

### Production (Render)

After deploy, replace `<your-render-app>`:

- https://<your-render-app>.onrender.com/api-docs
- https://<your-render-app>.onrender.com/docs/openapi.yaml
- https://<your-render-app>.onrender.com/docs/swagger.json

## Structure

```
docs/
  openapi.yaml
  swagger.json
  index.html
  swagger/
    paths/
    components/
      schemas/
      responses/
```
