class Keyword {
  // Keyword: SearchPatient
  SearchPatient() {
    // Wait for the patient elements to be visible
    cy.xpath("//div[@role='gridcell' and @col-id='ShortName'][1]").should(
      "be.visible"
    );

    // Get all patient elements based on the locator
    cy.xpath("//div[@role='gridcell' and @col-id='ShortName']").then(
      (patientElements) => {
        // If no patients are found, log a warning and return
        if (patientElements.length === 0) {
          cy.log("No patients found in the list.");
          return null;
        }

        // Select a random patient element
        const randomIndex = Math.floor(Math.random() * patientElements.length);
        const randomPatientElement = patientElements[randomIndex];

        cy.wrap(randomPatientElement)
          .invoke("text")
          .then((patientName) => {
            const trimmedPatientName = patientName.trim(); // Trim the patient name if needed

            if (trimmedPatientName) {
              // Assuming `searchBarLocator` is the locator for the search input field
              const searchBarLocator = "#quickFilterInput";

              // Wait for the search bar to be visible and fill it with the patient name
              cy.get(searchBarLocator)
                .should("be.visible")
                .type(trimmedPatientName)
                .type("{enter}"); // Using the trimmed name here

              // Wait for a short period to allow search results to load
              cy.wait(1000); // This can be replaced with a more specific wait if necessary

              // Log the patient name that is being searched for
              cy.log(`Searching for patient: ${trimmedPatientName}`);

              // Use cy.wrap() if you need to pass the patient name to further commands
              cy.wrap(trimmedPatientName).as("patientName"); // Store the patient name in an alias for further use
            } else {
              cy.log("Patient name could not be extracted.");
            }
          });
      }
    );
  }

  VerifyResults(patientName) {
    // Wait for the search results to be visible
    cy.xpath("//div[@role='gridcell' and @col-id='ShortName']").should(
      "be.visible"
    );

    // Fetch all result elements and check if the patient name is in the results
    cy.xpath("//div[@role='gridcell' and @col-id='ShortName']").each(
      (result) => {
        cy.wrap(result).invoke("text").should("include", patientName);
      }
    );
  }
}

export default Keyword;
