import PatientSearchHelper from "../../support/ReusableMethod";
import patientName from "../../fixtures/patientNames.json";

class AppointmentPage {
  titleName = "//span[text() = 'Patient List |']";
  counters = "//div[@class='counter-item']";
  appointment = `a[href="#/Appointment"]`;
  selectCounter = "//span[text()='Click to Activate']";
  patientName = "(//div[@role='gridcell' and @col-id='ShortName'])[1]";
  searchBar = "#quickFilterInput";
  searchResultPatientName = "//div[@role='gridcell' and @col-id='ShortName']";
  hospitalSearchBar = "#id_input_search_using_hospital_no";
  patientCode = "//div[@role='gridcell' and @col-id='PatientCode'][1]";
  newVisitTab = `//a[contains(text(),'New Visit')]`;
  newVisitHeading = `//h3[contains(@class,"heading")]`;

  /**
   * @Test2
   * @description This method searches for patients by their name and verifies that the search results
   *              accurately match the expected patient names. It ensures that the displayed patient name 
   *              in the search results corresponds to the searched name, confirming the search functionality 
   *              operates correctly
   */
  searchAndVerifypatientName() {
    cy.get(this.appointment).should("be.visible").first().click();
    cy.xpath(this.selectCounter).should("be.visible").first().click();
    cy.xpath(this.patientName).invoke("text");
    cy.get(this.searchBar).should("be.visible").type(patientName.PatientNames[0].Patient1);
    cy.wait(2000);
    cy.xpath(this.searchResultPatientName)
      .should("be.visible")
      .first()
      .invoke("text")
      .then((displayedName) => {
        expect(displayedName.trim()).to.equal(patientName.PatientNames[0].Patient1);
      });
  }

  /**
   * @Test9.1
   * @description Initiates the patient search process in the appointment section.
   *              It creates an instance of the `PatientSearchHelper` class in support folder, clicks on the
   *              appointment dropdown, selects a counter, and then calls the `searchPatient()`
   *              method from the helper to perform the actual search.
   * @returns {void}
   */
  searchPatientInAppointment() {
    const patientSearchHelper = new PatientSearchHelper(this.page);
    cy.get(this.appointment).should("be.visible").first().click();
    cy.wait(2000);
    cy.xpath(this.selectCounter).should("be.visible").first().click();
    patientSearchHelper.searchPatient();
  }

  /**
   * @Test11 This method opens the New Visit page in the appointment module using the Alt + N keyboard shortcut.
   *
   * @description This function clicks the appointment link to navigate to the appointment module.
   *              It then clicks on the "New Visit" tab and simulates pressing the Alt + N keyboard shortcut to open
   *              the New Visit page. After triggering the shortcut, it waits for the page to load and verifies that
   *              the New Visit page is displayed by checking the visibility of the New Visit heading and the URL.
   */
  openNewVisitPageThroughKeyboardButton() {
    // Navigate to Appointment module
    cy.get(this.appointment).click();

    // Wait for counters to load and check counter items
    cy.wait(5000);
    cy.xpath("//div[@class='counter-item']").then(($counterItems) => {
      const counterCount = $counterItems.length;
      cy.log("counter count is " + counterCount);

      if (counterCount > 0) {
        // Select the first counter item if available
        cy.wrap($counterItems.first()).click();
        cy.get(this.appointment).click();
      } else {
        cy.log("No counter items available");
      }
    });

    // Click on the New Visit tab
    cy.xpath(this.newVisitTab).click();

    // Trigger Alt + Enter keyboard shortcut to open the New Visit page
    cy.get('body').type('{alt}n'); // Alt + N shortcut

    // Wait for the New Visit page to load
    cy.wait(2000);

    // Verify the New Visit page is displayed
    cy.xpath(this.newVisitHeading).should('be.visible');
    cy.url().should('include', 'Appointment/Visit');
  }
}

export default AppointmentPage;
