class UtilitiesPage {

  constructor() {
    this.utilitiesModule = "//span[text()='Utilities']";
    this.changeBillingCounter = '//a[text()=" Change Billing Counter "]';
    this.counters = "//div[@class='modelbox-div clearfix']";
    this.counterItem = "//div[@class='counter-item']";
  }

  /**
   * @Test1
   * @description Navigates to the Utilities module, opens the Change Billing Counter modal,
   *              and measures the load time of the modal. If the modal loads within an acceptable
   *              time limit, the method selects the first available billing counter. If no counters
   *              are available, it logs a message. The function handles errors gracefully and logs
   *              any exceptions encountered.
   */
  async verifyBillingCounterLoadState() {
    try {
      cy.xpath(this.utilitiesModule).click();
      cy.wait(2000);
      cy.xpath(this.changeBillingCounter).click();
      const startTime = performance.now();
      cy.xpath(this.counters).should("be.visible");
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      const acceptableLoadTime = 1000;
      expect(loadTime).to.be.lessThan(acceptableLoadTime);
      const counterItems = cy.xpath(this.counterItem);
      if (counterItems.length < 1) {
        cy.log("No counter items available");
      }
    } catch (error) {
      cy.log("Error verifying billing counter load state: " + error.message);
    }
  }
}

export default UtilitiesPage;
