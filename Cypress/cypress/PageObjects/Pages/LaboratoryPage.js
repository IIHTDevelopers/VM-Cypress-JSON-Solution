class LaboratoryPage {

  constructor() {
    this.laboratoryLinkXPath = '//a[@href="#/Lab"]';
    this.laboratoryDashboardXPath = '//a[@href="#/Lab/Dashboard"]';
    this.settingsSubModuleXPath = '(//a[@href="#/Lab/Settings"])[2]';
    this.addNewLabTestXPath = '//a[contains(text(),"Add New Lab Test")]';
    this.addButtonXPath = '//button[contains(text(),"Add")]';
    this.closeButtonXPath = '//button[contains(text(),"Close")]';
    this.starIconXPath = '//i[@title="Remember this Date"]';
  }

  laboratoryLink() {
    return cy.xpath(this.laboratoryLinkXPath);
  }

  laboratoryDashboard() {
    return cy.xpath(this.laboratoryDashboardXPath);
  }

  settingsSubModule() {
    return cy.xpath(this.settingsSubModuleXPath);
  }

  addNewLabTest() {
    return cy.xpath(this.addNewLabTestXPath);
  }

  addButton() {
    return cy.xpath(this.addButtonXPath);
  }

  closeButton() {
    return cy.xpath(this.closeButtonXPath);
  }

  starIcon() {
    return cy.xpath(this.starIconXPath);
  }

  getErrorMessageLocator(errorMessage) {
    return cy.xpath(
      `//p[contains(text(),"error")]/../p[contains(text(),"${errorMessage}")]`
    );
  }

  /**
   * @Test5
   * @Description This method verifies the error message when attempting to add a new lab test without entering required values.
   * Navigates to Laboratory > Settings, selects "Add New Lab Test," and clicks the Add button without providing any input.
   * Captures and returns the displayed error message.
   */
  verifyErrorMessage() {
    cy.xpath(this.laboratoryLinkXPath)
      .click()
      .then(() => {
        cy.xpath(this.settingsSubModuleXPath).click();
        cy.xpath(this.addNewLabTestXPath).click();
        cy.xpath(this.addButtonXPath).click();

        // Use the passed 'expectedErrorMessage' to validate the error message
        this.getErrorMessageLocator("Lab Test Code Required.")
          .should("be.visible")
          .invoke("text")
          .should("eq", "Lab Test Code Required."); // Compare with the text from Excel
      });
  }

  /**
   * @Test12 This method verifies the tooltip text of the star icon in the laboratory dashboard.
   * @description This function navigates to the laboratory page and dashboard, hovers over the star icon, and
   *              waits for the tooltip to appear. It verifies the visibility of the star icon and retrieves the tooltip
   *              text. 
   */
  verifyStarTooltip() {
    cy.xpath(this.laboratoryLinkXPath)
      .click()
      .then(() => {
        cy.xpath(this.starIconXPath)
          .trigger('mouseover') // Hover over the star icon
          .invoke('attr', 'title') // Get the 'title' attribute
          .should('exist') // Ensure the tooltip exists
          .and('eq', 'Remember this Date'); // Verify the tooltip text
      });
  }

}

export default LaboratoryPage;
