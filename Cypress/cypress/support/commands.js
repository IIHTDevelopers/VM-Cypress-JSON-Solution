// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.login
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

//Custom Cypress command for browser launching.
Cypress.Commands.add("launchBrowser", () => {
  cy.log("Browser is launched automatically by Cypress.");
});

//Custom Cypress command for navigating to base URL
Cypress.Commands.add("navigatingToBaseURL", () => {
  cy.visit("https://healthapp.yaksha.com/");
});

//Custom Cypress command for close browser
Cypress.Commands.add("closeBrowser", () => {
  cy.log("Tests completed. Browser will close automatically by Cypress.");
});

//Custom Cypress command for highlight the element
Cypress.Commands.add("highlight", (xpath) => {
  cy.xpath(xpath).then(($el) => {
    // Apply a temporary style to highlight the element
    $el.css("background-color", "yellow"); // Change to any color you prefer
    cy.wait(500); // Wait for 0.5 seconds to show the highlight
    $el.css("background-color", ""); // Remove the highlight
  });
});

// Custom command to load data from an Excel sheet
Cypress.Commands.add("loadExcelData", (sheetName) => {
  const filePath = "cypress/fixtures/CypressAutomationSheet.xlsx";

  cy.readFile(filePath, "binary").then((data) => {
    const XLSX = require("xlsx");
    const workbook = XLSX.read(data, { type: "binary" });
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(
        `Sheet with name "${sheetName}" not found in the Excel file.`
      );
    }

    const jsonData = XLSX.utils.sheet_to_json(sheet);
    // Convert jsonData into an object using the first row's keys as property names
    const dataObject = jsonData.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        acc[key.trim()] = row[key];
      });
      return acc;
    }, {});

    cy.wrap(dataObject).as(sheetName); // Save the data as an alias for access
  });
});

Cypress.Commands.add("loadJsonData", (arrayName) => {
  const filePath = "/testData.json";

  // Read the JSON file
  cy.fixture(filePath).then((jsonData) => {
    // Check if the requested array exists in the JSON
    if (!jsonData[arrayName]) {
      throw new Error(
        `Array with name "${arrayName}" not found in the JSON file.`
      );
    }

    // Return the array as a Cypress alias for further use
    cy.wrap(jsonData[arrayName]).as(arrayName);
  });
});

/// <reference types="Cypress" />
/// <reference types="cypress-xpath" />

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
