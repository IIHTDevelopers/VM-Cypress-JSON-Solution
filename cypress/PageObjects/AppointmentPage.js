import PatientSearchHelper from "../e2e/ReusableMethod";
import Keyword from "../e2e/Keywords";
class AppointmentPage {
  titleName = "//span[text() = 'Patient List |']";
  counters = "//div[@class='counter-item']";
  appointment = "//span[text()='Appointment']";
  selectCounter = "//span[text()='Click to Activate']";
  patientName = "(//div[@role='gridcell' and @col-id='ShortName'])[1]";
  searchBar = "#quickFilterInput";
  searchResultPatientName = "//div[@role='gridcell' and @col-id='ShortName']";
  hospitalSearchBar = "#id_input_search_using_hospital_no";
  patientCode = "//div[@role='gridcell' and @col-id='PatientCode'][1]";

  /**
   * @Test3.1
   * @description Clicks on the Appointment dropdown after ensuring its visibility.
   *              The method finds the Appointment dropdown using XPath, checks for its visibility,
   *              and then clicks it to expand or activate the dropdown.
   * @returns {Cypress.Chainable} - A Cypress chainable object for further actions and assertions.
   */
  appointmentDropdownClick() {
    cy.xpath(this.appointment).should("be.visible").first().click();
  }

  /**
   * @Test3.2
   * @description Clicks on the counter selection element after ensuring its visibility.
   *              The method finds the counter selection element using XPath, checks for its visibility,
   *              and clicks it to activate the selection.
   * @returns {Cypress.Chainable} - A Cypress chainable object for further actions and assertions.
   */
  counterSelectionClick() {
    cy.xpath(this.selectCounter).should("be.visible").first().click();
  }

  /**
   * @Test3.3
   * @description Retrieves the text of the first patient's name from the displayed list.
   *              The method uses XPath to find the element containing the patient's name,
   *              invokes the "text" method to retrieve the name as text, and returns it.
   * @returns {Cypress.Chainable<string>} - A Cypress chainable object that resolves to the text of the first patient's name.
   */
  getFirstPatientName() {
    return cy.xpath(this.patientName).invoke("text");
  }

  /**
   * @Test3.4
   * @description Searches for a patient by name using the search bar.
   *              The method clears the search bar, types the provided patient name,
   *              and ensures the search bar is visible before typing.
   * @param {string} patientName - The name of the patient to search for.
   * @returns {Cypress.Chainable<void>} - A Cypress chainable object that performs the search.
   */
  searchPatient(patientName) {
    cy.get(this.searchBar).should("be.visible").type(patientName);
  }

  /**
   * @Test3.5
   * @description Validates that the displayed patient name matches the searched patient name.
   *              The method asserts that the displayed name in the search result matches
   *              the expected patient name, ensuring the search was successful.
   * @param {string} patientName - The expected name of the patient to validate against.
   * @returns {Cypress.Chainable<void>} - A Cypress chainable object for assertion.
   */
  validatePatientDetail(patientName) {
    cy.xpath(this.searchResultPatientName)
      .should("be.visible")
      .first()
      .invoke("text")
      .then((displayedName) => {
        expect(displayedName.trim()).to.equal(patientName.trim());
      });
  }

  /**
   * @Test14
   * @description Searches for a patient in the appointment list and verifies the patient's details before and after the search.
   *              The method clicks on the appointment and counters sections, retrieves the patient name and code before
   *              searching, then types the patient's name into the search bar. It verifies that the patient name and code
   *              match before and after the search in the list.
   * @returns {void}
   */
  searchAndVerifyPatientList() {
    cy.xpath(this.appointment).should("be.visible").first().click();
    cy.xpath(this.counters).first().click();
    cy.wait(3000);

    cy.xpath(this.titleName).should("be.visible");
    cy.xpath(this.patientName).should("be.visible");
    cy.xpath(this.patientCode).should("be.visible");

    cy.xpath(this.patientName)
      .invoke("text")
      .then((patientNameBeforeSearch) => {
        const patientName1 = patientNameBeforeSearch.trim();
        cy.log(`Patient Name before search: ${patientName1}`);

        cy.xpath(this.patientCode)
          .first()
          .invoke("text")
          .then((patientCodeBeforeSearch) => {
            const patientCode1 = patientCodeBeforeSearch.trim();
            cy.log(`Patient Code before search: ${patientCode1}`);

            cy.get(this.searchBar)
              .should("be.visible")
              .clear()
              .type(patientName1);
            cy.get(this.searchBar).type("{enter}");
            cy.wait(3000);

            cy.xpath("//div[@role='gridcell' and @col-id='ShortName']").each(
              ($nameCell, index) => {
                const patientNameAfter = $nameCell.text().trim();
                cy.log(
                  `Patient Name after search (Row ${
                    index + 1
                  }): ${patientNameAfter}`
                );
                expect(patientNameAfter).to.equal(patientName1);

                cy.xpath(
                  `//div[@role='gridcell' and @col-id='PatientCode'][${
                    index + 1
                  }]`
                )
                  .invoke("text")
                  .then((patientCodeAfterSearch) => {
                    const patientCodeAfter = patientCodeAfterSearch.trim();
                    cy.log(
                      `Patient Code after search (Row ${
                        index + 1
                      }): ${patientCodeAfter}`
                    );
                    expect(patientCodeAfter).to.equal(patientCode1);
                  });
              }
            );
          });
      });
  }

  /**
   * @Test11.1
   * @description Initiates the patient search process in the appointment section.
   *              It creates an instance of the `PatientSearchHelper` class, clicks on the
   *              appointment dropdown, selects a counter, and then calls the `searchPatient()`
   *              method from the helper to perform the actual search.
   * @returns {void}
   */
  searchPatientInAppointment() {
    const patientSearchHelper = new PatientSearchHelper(this.page);
    this.appointmentDropdownClick();
    cy.wait(2000);
    this.counterSelectionClick();
    patientSearchHelper.searchPatient();
  }

  /**
   * @Test10
   * @description Searches for a patient using a keyword and verifies the results.
   *              It first highlights and clicks the appointment section, selects a counter,
   *              and retrieves the patient's name using a helper method. If the patient's name is found,
   *              it proceeds to verify the results, otherwise, it logs an error.
   *              If any error occurs during the process, it logs the error and returns false.
   * @returns {boolean} - Returns true if the patient is found and results are verified, false otherwise.
   */
  searchAndVerifyPatient() {
    try {
      const keyword = new Keyword();
      cy.highlight(this.appointment);
      cy.xpath(this.appointment).first().click();
      cy.xpath(this.selectCounter).first().click();
      cy.wait(2000);
      const patientName = keyword.SearchPatient();
      if (!patientName) {
        console.error("No patient name found to search for.");
        return false; // Return false if no patient name is found
      }
      keyword.VerifyResults(patientName);
      return true;
    } catch (e) {
      console.error("Error selecting random counter:", e);
      return false;
    }
  }
}
export default AppointmentPage;
