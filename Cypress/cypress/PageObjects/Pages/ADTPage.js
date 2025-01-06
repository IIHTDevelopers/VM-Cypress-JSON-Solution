import PatientSearchHelper from "../../e2e/ReusableMethod";

class ADTPage {
  ADT = "//span[text()='ADT']";
  counters = "//div[@class='counter-item']";

  /**
   * @Test9.3
   * @description Initiates the patient search process in the ADT (Admission, Discharge, Transfer) page.
   *              It creates an instance of the `PatientSearchHelper` class, clicks on the ADT dropdown,
   *              and then calls the `searchPatient()` method from the helper to perform the actual search.
   * @returns {void}
   */
  searchPatientInADT() {
    const patientSearchHelper = new PatientSearchHelper(this.page);
    cy.xpath(this.ADT).should("be.visible").first().click();
    cy.wait(2000);
    patientSearchHelper.searchPatient();
  }
}

export default ADTPage;
