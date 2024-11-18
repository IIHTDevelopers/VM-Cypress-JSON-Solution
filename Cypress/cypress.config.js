const { defineConfig } = require('cypress');
const CustomReporter = require('./custom-reporter'); // Adjust the path as needed

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Yaksha Automation Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      const reporter = new CustomReporter();

      on('after:spec', async (spec, results) => {
        if (results && results.tests) {
          for (const test of results.tests) {
            const status = test.state; // 'passed', 'failed', or 'skipped'
            const error = test.displayError || '';
            await reporter.logTestResult(test, status, error);
          }
        }
      });

      on('after:run', async () => {
        await reporter.onEnd();
      });

      return config;
    },
    defaultCommandTimeout: 60000,
  },
});


// const { defineConfig } = require('cypress');
// const CustomReporter = require('./custom-reporter'); // Adjust path if necessary

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
//       // Initialize the built-in mochawesome reporter
//       require('cypress-mochawesome-reporter/plugin')(on);

//       // Initialize the custom reporter
//       const reporter = new CustomReporter();

//       on('after:spec', (spec, results) => {
//         if (results && results.tests) {
//           results.tests.forEach((test) => {
//             const status = test.state; // 'passed', 'failed', or 'skipped'
//             const error = test.displayError || '';
//             reporter.logTestResult(test, status, error);
//           });
//         }
//       });

//       on('after:run', () => {
//         reporter.onEnd();
//       });

//       return config;
//     },
//     defaultCommandTimeout: 60000,
//   },
// });





// const { defineConfig } = require('cypress');
// const customReporter = require('./custom-reporter');

// module.exports = defineConfig({
//   e2e: {
//     setupNodeEvents(on, config) {
//       customReporter(on); // Attach the custom reporter
//       return config;
//     },
//     specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
//     defaultCommandTimeout: 60000,
//   },
// });




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
