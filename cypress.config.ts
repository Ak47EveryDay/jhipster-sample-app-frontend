import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  downloadsFolder: 'cypress/downloads',
  videosFolder: 'cypress/videos',
  chromeWebSecurity: true,
  viewportWidth: 1200,
  viewportHeight: 720,
  retries: 2,
  expose: {
    adminUsername: 'admin',
    adminPassword: 'admin',
    username: 'user',
    password: 'user',
    authenticationUrl: '/api/authenticate',
    jwtStorageName: 'jhi-authenticationToken',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    async setupNodeEvents(on, config) {
      return (await import('./cypress/plugins/index')).default(on, config);
    },
    baseUrl: 'http://localhost:9060/',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/index.ts',
    experimentalRunAllSpecs: true,
  },
});
