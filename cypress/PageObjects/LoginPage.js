class LoginPage {
  user = "//input[@id='username_id']";
  pass = "//input[@id='password']";
  signIn = "//button[@id='login']";
  errorMsg = "//div[contains(text(),'Invalid credentials !')]";
  admin = "(//a[@class='dropdown-toggle'])[3]";
  logout = "//a[text() = ' Log Out ']";

  enterUsername(userName) {
    cy.xpath(this.user).should("be.visible").type(userName);
  }

  enterPassword(password) {
    cy.xpath(this.pass).should("be.visible").type(password);
  }

  signInButtonClick() {
    cy.xpath(this.signIn).should("be.visible").click();
  }

  errorMsgValidate() {
    cy.xpath(this.errorMsg).should("be.visible");
  }

  /**
   * @Test1 @Test18.1
   * @description Clicks on the Admin dropdown menu after ensuring its visibility.
   *              The method finds the Admin element using XPath and clicks it.
   * @returns {Cypress.Chainable} - A Cypress chainable object for further actions and assertions.
   */
  clickAdmin() {
    cy.xpath(this.admin).should("be.visible").click();
  }

  /**
   * @Test1 @Test18.2
   * @description Clicks on the Log Out button after ensuring its visibility.
   *              The method finds the Log Out button using XPath and clicks it to log out.
   * @returns {Cypress.Chainable} - A Cypress chainable object for further actions and assertions.
   */
  clickLogout() {
    cy.xpath(this.logout).should("be.visible").click();
  }
}
export default LoginPage;
