class DispensaryPage {
  constructor() {
    this.maxRetries = 3;
    this.timeoutDuration = 5000;
    this.dispensary = {
      dispensaryLink: 'a[href="#/Dispensary"]',
      activateCounter: 'a[href="#/Dispensary/ActivateCounter"]',
      counterSelection: ".counter-item",
      counterName: ".counter-item h5",
      activatedCounterInfo: "div.mt-comment-info",
      deactivateCounterButton: 'button:contains("Deactivate Counter")',
      titleName: "span.caption-subject",
      name: '(//div[@class="col-sm-4 col-md-3"]//label//span)[1]',
      prescription: 'a:contains("Prescription")',
    };
  }

  dispensaryLink = "//span[text()='Dispensary']";
  counters = "//div[@class='counter-item']";
  activateCounter = "//a[contains(text(),'Counter')]";
  resultantText = "//div[@class='mt-comment-info']//b";
  deactivateCounter = "//button[contains(text(),'Deactivate Counter')]";

  /**
   * @Test12
   * @description Verifies if a counter is activated. This method clicks on the dispensary link, selects a counter,
   *              activates it, and then verifies if the deactivation option is visible, indicating the counter
   *              has been activated successfully.
   * @returns {void}
   */
  verifyCounterisActivated() {
    cy.xpath(this.dispensaryLink).should("be.visible").click();
    cy.xpath(this.counters).should("be.visible").first().click();
    cy.wait(3000);
    cy.xpath(this.activateCounter).should("be.visible").first().click();
    cy.xpath(this.deactivateCounter).should("be.visible");
  }

  /**
   * @Test4
   * @description Verifies the activation message for a random counter in the dispensary module.
   *              If the counter name in the activation message matches, returns true.
   * @return {boolean} - Returns true if the activation message contains the selected counter name.
   */
  /**
   * @description Verifies the activation message for a random counter in the dispensary module.
   *              If the counter name in the activation message matches, returns true.
   * @return {boolean} - Returns true if the activation message contains the selected counter name.
   */
  verifyActiveCounterMessageInDispensary() {
    cy.get(this.dispensary.dispensaryLink).click();

    cy.wait(2000);

    cy.xpath(this.activateCounter).click();

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

            cy.get(this.dispensary.activateCounter).eq(1).click();

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
   * @Test16
   * @description Attempts to navigate to the Dispensary page, retrying up to 3 times if navigation fails.
   *              The function clicks on the Dispensary link, activates a counter, and waits for elements to become visible.
   * @returns {boolean} - Returns true if navigation succeeds, false if it fails after 3 attempts.
   */
  navigateToDispensary() {
    let attempt = 0;
    const maxRetries = 3;
    const timeoutDuration = 10000;
    while (attempt < maxRetries) {
      try {
        attempt++;
        console.log(`Attempt ${attempt} to navigate to Dispensary page`);
        cy.get(this.dispensary.dispensaryLink).click();
        cy.xpath(this.activateCounter).click();
        cy.wait(2000);
        cy.get(this.dispensary.counterSelection).first().click();
        cy.wait(2000);
        cy.xpath(this.activateCounter).click();
        cy.xpath("//div[@class='portlet light bordered ']", {
          timeout: timeoutDuration,
        }).should("be.visible");
        console.log(
          `Successfully navigated to Dispensary page on attempt ${attempt}`
        );
        return true;
      } catch (error) {
        console.error(`Navigation failed on attempt ${attempt}:`, error);
        if (attempt >= maxRetries) {
          console.error(
            "Max retries reached. Failed to navigate to Dispensary page."
          );
          return false;
        }
        cy.wait(2000);
      }
    }
    return false;
  }
}

export default DispensaryPage;
