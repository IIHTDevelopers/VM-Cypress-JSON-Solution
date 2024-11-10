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
   * @Test6
   * @Description This method verifies the error message when attempting to add a new lab test without entering required values.
   * Navigates to Laboratory > Settings, selects "Add New Lab Test," and clicks the Add button without providing any input.
   * Captures and returns the displayed error message.
   * @return string - The error message text, trimmed of any whitespace.
   */
  verifyErrorMessage() {
    cy.xpath(this.laboratoryLinkXPath)
      .click()
      .then(() => {
        cy.xpath(this.settingsSubModuleXPath).click();
        cy.xpath(this.addNewLabTestXPath).click();
        cy.xpath(this.addButtonXPath).click();

        this.getErrorMessageLocator("Lab Test Code Required.")
          .should("be.visible")
          .invoke("text")
          .should("eq", "Lab Test Code Required.");
      })
      .then(() => {
        cy.xpath(this.closeButtonXPath).click();
      });
  }

  /**
   * @Test15
   * @description This method verifies the star tooltip text when hovering over the star icon.
   * @return string - The tooltip text of the star icon.
   */
  verifyStarTooltip() {
    cy.xpath(this.laboratoryLinkXPath)
      .click()
      .then(() => {
        cy.xpath(this.starIconXPath)
          .invoke("attr", "title")
          .should("exist")
          .and("eq", "Remember this Date");
      });
  }
}

export default LaboratoryPage;
