# jhipster-sample-app-frontend

Angular frontend of the JHipster sample application (bank accounts, labels and operations), split out of [jhipster/jhipster-sample-app](https://github.com/jhipster/jhipster-sample-app) (generated with JHipster 9.4.0, commit `6b000b5d`).

It talks to the backend over HTTP only. The backend lives in a separate repository, [jhipster-sample-app-backend](https://github.com/Ak47EveryDay/jhipster-sample-app-backend).

## Requirements

- Node.js 24.21 or later
- npm

## Development

Start the backend first (see its README; it listens on `http://localhost:8080`), then:

```bash
npm install
npm start
```

Open `http://localhost:9060` and sign in with `admin/admin` or `user/user`. The dev server proxies `/api`, `/management`, `/v3/api-docs` and `/h2-console` to `127.0.0.1:8080` (see `proxy.config.mjs`), so the browser only talks to one origin.

## Building

```bash
npm run build
```

The result is a static site in `dist/jhipster-sample-app-frontend/` that any static file server can host. Two things are up to the server that hosts it:

- Requests to `/api/**`, `/management/**` and `/v3/api-docs/**` must reach the backend. Either reverse-proxy them, or build with `SERVER_API_URL=https://<backend host>/` so the browser calls the backend directly; the backend then has to allow the frontend origin in its CORS settings. A missing trailing slash in `SERVER_API_URL` is added automatically.
- Paths without a file extension (for example `/bank-account/edit/1`) must return `index.html`, so that deep links and page refreshes work.

## Testing

```bash
npm test          # lint, then unit tests (Vitest); coverage is written to coverage/
npm run lint
```

End-to-end tests use Cypress. They need Chrome, the frontend dev server and the backend all running:

```bash
npm start              # terminal 1
npm run e2e:headless   # terminal 2, once `npm start` has finished: waits for the backend, then runs Chrome headless
```

## What changed in the split

- Sources moved from `src/main/webapp` to `src/`, the Cypress tests from `src/test/javascript/cypress` to `cypress/`.
- Build output goes to `dist/` instead of the backend's `target/classes/static/`. Maven is no longer involved.
- The scripts that delegated to `./mvnw` were removed. `generator-jhipster` is no longer a dependency, so the project cannot be regenerated with JHipster.

## License

Apache-2.0, see `LICENSE.txt`.
