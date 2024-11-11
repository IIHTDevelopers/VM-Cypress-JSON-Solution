// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

//Custom Cypress command for browser launching.
Cypress.Commands.add('launchBrowser', () => {
    cy.log('Browser is launched automatically by Cypress.');
});

//Custom Cypress command for navigating to base URL
Cypress.Commands.add('navigatingToBaseURL', () => {
 cy.visit('https://healthapp.yaksha.com/');
});

//Custom Cypress command for close browser
Cypress.Commands.add('closeBrowser', () => {
    cy.log('Tests completed. Browser will close automatically by Cypress.');
});

//Custom Cypress command for highlight the element
Cypress.Commands.add('highlight', (xpath) => {
    cy.xpath(xpath)
        .then($el => {
            // Apply a temporary style to highlight the element
            $el.css('background-color', 'yellow'); // Change to any color you prefer
            cy.wait(500); // Wait for 0.5 seconds to show the highlight
            $el.css('background-color', ''); // Remove the highlight
        });
});

// Custom Cypress command for valid login into the Yaksha application
Cypress.Commands.add('login', (login, home) => {
    // Load the fixture data
    cy.fixture('userCredentials').then((data) => {
        // Highlight and enter username
        cy.highlight(login.user);
        login.enterUsername(data.ValidUserName);
        
        // Highlight and enter password
        cy.highlight(login.pass);
        login.enterPassword(data.ValidPassword);
        
        // Highlight and click the sign-in button
        cy.highlight(login.signIn);
        login.signInButtonClick();
        
        // Verify user navigates to homepage after login
        home.verifyRegisteredPatientText();
    });
});

// Custom Cypress command for invalid login into the Yaksha application
Cypress.Commands.add('invalidLogin', (login, home) => {
    // Load the fixture data
    cy.fixture('userCredentials').then((data) => {
        // Highlight and enter username
        cy.highlight(login.user);
        login.enterUsername(data.InValidUserName);
        
        // Highlight and enter password
        cy.highlight(login.pass);
        login.enterPassword(data.InValidPassword);
        
        // Highlight and click the sign-in button
        cy.highlight(login.signIn);
        login.signInButtonClick();
        
        // Verify Error message
        login.errorMsgValidate();  
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

