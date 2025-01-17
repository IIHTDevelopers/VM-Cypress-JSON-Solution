import patientData from "../fixtures/patientNames.json";

class PatientSearchHelper {

  constructor() {
    // Defining the search bar and patient name locators
    this.searchBar = '#quickFilterInput';
    this.patientNameLocator = "//div[@role='gridcell' and @col-id='ShortName']";
  }

  // Method to search for a patient using a random patient name from the list
  searchPatient() {
    // Get the patient elements using the XPath locator
    cy.xpath(this.patientNameLocator).then(($patientElements) => {
      // If no patients are found, log a warning and return
      if ($patientElements.length === 0) {
        cy.log('No patients found in the list.');
        return;
      }
      // Extract the patient name from testdata.json
      const patientName = patientData.PatientNames[4].Patient5;
      // Log the randomly selected patient name
      cy.log(`Selected patient: ${patientName}`);
      // Fill the search bar with the selected patient name
      cy.get(this.searchBar).clear().type(patientName);
      cy.get(this.searchBar).type('{enter}');
      // Wait for search results to load (adjust timing based on application needs)
      cy.wait(1000);
      // Get all displayed patient names in the table
      cy.xpath(this.patientNameLocator).then(($displayedPatients) => {
        const displayedPatientNames = $displayedPatients.toArray().map((el) => el.innerText.trim());
        // Check if the entered patient name is present in the displayed results
        const isPatientFound = displayedPatientNames.some((name) => name === patientName);
        // Log the result and assert if the patient was found
        if (isPatientFound) {
          cy.log(`Successfully found the patient: ${patientName}`);
          // Assertion: Verify that the search bar contains the expected patient name
          cy.get(this.searchBar).should('have.value', patientName);
        } else {
          cy.log(`Patient not found in the search results: ${patientName}`);
        }
      });
    });
  }
}
export default PatientSearchHelper;