import PatientSearchHelper from "../../e2e/ReusableMethod";
class ADTPage {
  ADT = "//span[text()='ADT']";
  counters = "//div[@class='counter-item']";

  adtDropdownClick() {
    cy.xpath(this.ADT).should("be.visible").first().click();
  }

  counterSelectionClick() {
    cy.xpath(this.selectCounter).should("be.visible").first().click();
  }

  /**
   * @Test11.3
   * @description Initiates the patient search process in the ADT (Admission, Discharge, Transfer) page.
   *              It creates an instance of the `PatientSearchHelper` class, clicks on the ADT dropdown,
   *              and then calls the `searchPatient()` method from the helper to perform the actual search.
   * @returns {void}
   */
  searchPatientInADT() {
    const patientSearchHelper = new PatientSearchHelper(this.page);
    this.adtDropdownClick();
    cy.wait(2000);
    patientSearchHelper.searchPatient();
  }
}
export default ADTPage;
