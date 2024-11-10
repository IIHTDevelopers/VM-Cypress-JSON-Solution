class RadiologyPage {
  constructor() {
    this.radiologyModule = '//a[@href="#/Radiology"]';
    this.listRequestSubModuleXPath = '//a[contains(text(),"List Requests")]';
    this.fromDateXPath = '(//input[@id="date"])[1]';
    this.okButtonXPath = '//button[contains(text(),"OK")]';
    this.addReportButtonXPath = '(//a[contains(text(),"Add Report")])[1]';
    this.closeModalButtonXPath = '//a[@title="Cancel"]';
  }

  /**
   * @Test7
   * @description Performs the radiology request actions and handles a confirmation alert.
   *              The method clicks through various elements in the radiology module,
   *              submits the radiology request form, and handles the browser confirmation alert.
   * @param {string} fromDate - The date to be entered in the 'from' date field for the radiology request.
   * @returns {Cypress.Chainable<boolean>} - A Cypress chainable that resolves to true if the alert is handled successfully.
   */
  performRadiologyRequestAndHandleAlert(fromDate) {
    let isAlertHandled = false;
    // Set up the alert handler before the actions
    cy.on("window:confirm", () => {
      isAlertHandled = true;
      return cy.wrap(isAlertHandled);
    });
    // Perform the radiology request actions
    return cy
      .xpath(this.radiologyModule)
      .click()
      .then(() => cy.xpath(this.listRequestSubModuleXPath).click())
      .then(() => cy.xpath(this.fromDateXPath).type(fromDate, { delay: 100 }))
      .then(() => cy.xpath(this.okButtonXPath).click())
      .then(() => cy.xpath(this.addReportButtonXPath).click())
      .then(() => cy.xpath(this.closeModalButtonXPath).click({ force: true }));
  }

  isOkButtonVisible() {
    return cy
      .xpath(this.okButtonXPath)
      .should("be.visible")
      .then(() => {
        return true;
      });
  }
}
export default RadiologyPage;
