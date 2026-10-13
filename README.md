# RIMAC backend

NestJS REST API for Star Wars people and planets, backed by MySQL and SWAPI.

1. Run `npm ci`.
2. Copy `.env.example` to `.env`. Configure an existing MySQL database, its port (normally 3306), credentials and `SWAPI_URL`.
3. Run `npm run start:dev`. Swagger is at `http://localhost:3000/docs` with the sample HTTP port.

Checks: `npm run build`, `npm test -- --runInBand` and `npm run test:e2e` (requires the configured services).
TypeORM synchronizes the schema outside production; use a development database.
AWS Lambda configuration is in `serverless.yaml`; local setup does not require deployment.
