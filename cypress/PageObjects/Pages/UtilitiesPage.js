class UtilitiesPage {
  constructor() {
    this.utilitiesModule = "//span[text()='Utilities']";
    this.changeBillingCounter = '//a[text()=" Change Billing Counter "]';
    this.counters = "//div[@class='modelbox-div clearfix']";
    this.counterItem = "//div[@class='counter-item']";
  }

  /**
   * @Test2
   * @description Navigates to the Utilities module, opens the Change Billing Counter modal,
   *              and measures the load time of the modal. If the modal loads within an acceptable
   *              time limit, the method selects the first available billing counter. If no counters
   *              are available, it logs a message. The function handles errors gracefully and logs
   *              any exceptions encountered.
   * @return {Promise<boolean>} - Returns a Promise that resolves to true or false.
   */
  async verifyBillingCounterLoadState() {
    try {
      await cy.xpath(this.utilitiesModule).click();
      await cy.xpath(this.changeBillingCounter).click();
      const startTime = performance.now();
      await cy.xpath(this.counters).should("be.visible");
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      const acceptableLoadTime = 1000;
      if (loadTime > acceptableLoadTime) {
        cy.log(`Page load time exceeded acceptable limit: ${loadTime}ms`);
        return false;
      }
      expect(loadTime).to.be.lessThan(acceptableLoadTime);
      const counterItems = await cy.xpath(this.counterItem);
      if (counterItems.length > 0) {
        cy.wrap(counterItems[0]).click();
        return true;
      } else {
        cy.log("No counter items available");
        return false;
      }
    } catch (error) {
      cy.log("Error verifying billing counter load state: " + error.message);
      return false;
    }
  }
}
export default UtilitiesPage;
