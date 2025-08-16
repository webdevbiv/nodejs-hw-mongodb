import { Router } from 'express';
import fs from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import createHttpError from 'http-errors';
import { SWAGGER_PATH } from '../constants/index.js';

export function swaggerDocs() {
  const router = Router();

  if (!fs.existsSync(SWAGGER_PATH)) {
    router.use((_req, _res, next) =>
      next(
        createHttpError(
          503,
          'docs/swagger.json not built. Run: npm run build-docs',
        ),
      ),
    );
    return router;
  }

  let spec;
  try {
    spec = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf8'));
  } catch {
    router.use((_req, _res, next) =>
      next(createHttpError(500, "Can't load swagger docs")),
    );
    return router;
  }

  router.use(swaggerUi.serve);
  router.get('/', swaggerUi.setup(spec, { explorer: true }));

  return router;
}
