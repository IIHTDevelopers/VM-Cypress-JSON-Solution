const { defineConfig } = require('cypress');
const CustomReporter = require('./custom-reporter'); // Adjust path if necessary

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
      // Initialize the built-in mochawesome reporter
      require('cypress-mochawesome-reporter/plugin')(on);

      // Initialize the custom reporter
      const reporter = new CustomReporter();

      on('after:spec', (spec, results) => {
        if (results && results.tests) {
          results.tests.forEach((test) => {
            const status = test.state; // 'passed', 'failed', or 'skipped'
            const error = test.displayError || '';
            reporter.logTestResult(test, status, error);
          });
        }
      });

      on('after:run', () => {
        reporter.onEnd();
      });

      return config;
    },
    defaultCommandTimeout: 60000,
  },
});
