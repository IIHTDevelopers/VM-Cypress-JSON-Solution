import PatientSearchHelper from "../../e2e/ReusableMethod";
import patientData from "../../e2e/Data/PatientData.json";

class PatientPage {
  patient = "//span[text()='Patient']";
  searchBar = "#quickFilterInput";

  patientDropdownClick() {
    cy.xpath(this.patient).should("be.visible").first().click();
  }

  /**
   * @Test11.2
   * @description Initiates the patient search process in the patient page.
   *              It creates an instance of the `PatientSearchHelper` class, clicks on the
   *              patient dropdown, and then calls the `searchPatient()` method from the helper
   *              to perform the actual search.
   * @returns {void}
   */
  searchPatientInPatientPage() {
    const patientSearchHelper = new PatientSearchHelper(this.page);
    this.patientDropdownClick();
    cy.wait(2000);
    patientSearchHelper.searchPatient();
  }

  /**
   * @Test8
   * @description Searches for a list of patients using their names from the `patientData` array,
   *              verifies if the correct patient appears in the search results, and handles multiple searches.
   *              The method iterates over the first 5 patients, searching and verifying each patient’s name
   *              in the displayed results.
   * @returns {boolean} - Returns true if all searches are successfully verified; otherwise, it will stop at the first failure.
   */
  searchAndVerifyPatients() {
    cy.xpath(this.patient).first().click();
    cy.wait(2000);

    const searchBar = this.searchBar;

    cy.wait(2000);

    for (let i = 0; i < 5; i++) {
      const patientName = patientData.Results[i].ShortName;

      cy.get(searchBar).clear().type(patientName);
      cy.get("body").type("{enter}");

      cy.wait(3000);

      cy.xpath("//div[@role='gridcell' and @col-id='ShortName']").should(
        "have.text",
        patientName.trim()
      );
      cy.wait(3000);
      cy.get(searchBar).clear();
    }
    return true;
  }
}
export default PatientPage;
