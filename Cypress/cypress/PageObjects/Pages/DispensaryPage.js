import dayjs from 'dayjs';
import data from '../../e2e/Data/dateRange.json'

class DispensaryPage {
  constructor() {
    this.maxRetries = 3;
    this.timeoutDuration = 5000;
    this.dispensary = {
      dispensaryLink: 'a[href="#/Dispensary"]',
      activateCounter: "ul.page-breadcrumb li:nth-child(4) a",
      counterSelection: ".counter-item",
      counterName: ".counter-item h5",
      activatedCounterInfo: "div.mt-comment-info",
      deactivateCounterButton: 'button:contains("Deactivate Counter")',
      titleName: "span.caption-subject",
      name: '(//div[@class="col-sm-4 col-md-3"]//label//span)[1]',
      prescription: 'a:contains("Prescription")',
      counters: "//div[@class='counter-item']",
      resultantText: "//div[@class='mt-comment-info']//b",
      deactivateCounter: "//button[contains(text(),'Deactivate Counter')]",
      reports: "//a[contains(text(),'Reports')]",
      userCollectionReport: "//i[text()='User Collection']",
      fromDate: "(//input[@id='date'])[1]",
      showReportButton: "//span[text()='Show Report']",
      counterDropdown: "select#ddlCounter",
      counterNameFromTable: "div[col-id='CounterName']",
    };
  }

  /**
 * @Test3
 * @description This method verifies the activation message for a randomly selected counter in the dispensary module.
 *              It navigates to the dispensary section, selects a random counter, clicks the activation button, 
 *              and checks if the activation message contains the correct counter name.
 *              If no counters are available, an error is thrown.
 */
  verifyActiveCounterMessageInDispensary() {
    cy.get(this.dispensary.dispensaryLink).click();

    cy.wait(2000);

    cy.get(this.dispensary.activateCounter).click();

    cy.get(this.dispensary.titleName).should("be.visible");

    cy.get(this.dispensary.counterSelection).then(($counters) => {
      const counterCount = $counters.length;
      cy.log(`Counter count >> ${counterCount}`);

      if (counterCount >= 1) {
        const randomIndex = Math.floor(Math.random() * counterCount);
        cy.log(`Random counter index selected: ${randomIndex}`);

        cy.get(this.dispensary.counterName)
          .eq(randomIndex)
          .invoke("text")
          .then((fullCounterText) => {
            const counterName = fullCounterText
              .split("click to Activate")[0]
              .trim();
            cy.log(`Counter name at index ${randomIndex}: ${counterName}`);

            cy.get(this.dispensary.counterSelection).eq(randomIndex).click();

            cy.wait(2000);

            cy.get(this.dispensary.activateCounter).click();

            cy.get(this.dispensary.activatedCounterInfo)
              .invoke("text")
              .then((activatedCounterInfoText) => {
                cy.log(
                  `Activated counter info text: ${activatedCounterInfoText}`
                );

                expect(activatedCounterInfoText).to.include(counterName);
              });
          });
      } else {
        throw new Error("No counters available");
      }
    });
  }
  
  /**
   * @Test10 This method verifies if the "Morning Counter" is activated in the dispensary section.
   *
   * @description This function navigates to the dispensary module, selects the 'Morning Counter' from the dropdown,
   *              and generates the user collection report for the specified date range. It then verifies that the counter 
   *              name in the report matches the expected "Morning Counter" in the table.
   */
  generateMorningCounterReport() {
    const fromDate = data.FromDate;
    const fromDateFormatted = dayjs(fromDate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );

    // Navigate to the dispensary link
    cy.get(this.dispensary.dispensaryLink).click();
    cy.wait(2000);

    // Click on reports
    cy.xpath(this.dispensary.reports).click();

    // Click on user collection report
    cy.xpath(this.dispensary.userCollectionReport).click();

    // Input the FromDate
    cy.xpath(this.dispensary.fromDate).type(fromDateFormatted, { delay: 100 });

    // Select "Morning Counter" from the dropdown
    cy.get(this.dispensary.counterDropdown).select('Morning Counter');

    // Click on "Show Report" button
    cy.xpath(this.dispensary.showReportButton).click();
    cy.wait(2000);

    // Verify that the counter name in the table is "Morning Counter"
    cy.get(this.dispensary.counterNameFromTable).each(($el, index) => {
      if (index > 0) { // Skip the header or first element if applicable
        cy.wrap($el).should('have.text', 'Morning Counter');
      }
    });
  }
}

export default DispensaryPage;
