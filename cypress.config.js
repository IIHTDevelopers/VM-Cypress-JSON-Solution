const { defineConfig } = require('cypress');
const customReporter = require('./custom-reporter');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      customReporter(on); // Attach the custom reporter
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    defaultCommandTimeout: 60000,
  },
});




// const { defineConfig } = require('cypress');

// module.exports = defineConfig({
//   reporter: 'cypress-mochawesome-reporter',
//   reporterOptions: {
//     charts: true,
//     reportPageTitle: 'Yaksha Automation Report',
//     embeddedScreenshots: true,
//     inlineAssets: true,
//     saveAllAttempts: false,
//   },
//   e2e: {
//     setupNodeEvents(on, config) {
//       require('cypress-mochawesome-reporter/plugin')(on);
//     },
//     defaultCommandTimeout: 60000,
//   },
// });
