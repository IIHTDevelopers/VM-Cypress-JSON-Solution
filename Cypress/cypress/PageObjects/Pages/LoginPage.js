import loginData from '../../e2e/Data/loginData.json';
import invalidLoginData from '../../e2e/Data/invalidLogin.json';

class LoginPage {
  user = "//input[@id='username_id']";
  pass = "//input[@id='password']";
  signIn = "//button[@id='login']";
  errorMsg = "//div[contains(text(),'Invalid credentials !')]";
  admin = "(//a[@class='dropdown-toggle'])[3]";
  logout = "//a[text() = ' Log Out ']";

  /**
   * @Test0 This method logs in the user with valid credentials.
   *
   * @description This method performs the login operation using the provided valid credentials. It highlights the input
   *              fields for better visibility during interaction and fills the username and password fields. After submitting
   *              the login form by clicking the login button, it validates the success of the login process. The login is
   *              considered successful if there are no errors.
   */
  performLogin() {
    try {
      // Access login data from JSON
      const username = loginData.ValidLogin.ValidUserName;
      const password = loginData.ValidLogin.ValidPassword;

      // Fill username
      cy.xpath(this.user).clear().type(username);

      // Fill password
      cy.xpath(this.pass).clear().type(password);

      // Click sign-in button
      cy.xpath(this.signIn).click();

      // Verify successful login by checking if the 'admin' element is visible
      cy.xpath(this.admin).should('be.visible');
    } catch (e) {
      cy.log('Error during login:', e.message);
      throw e; // Rethrow the error for test failure
    }
  }

  /**
    * @Test15 Performs login with invalid credentials and validates error message.
    *
    * @description This method navigates to the login page, logs out if a session is active, and attempts to log in using 
    *              invalid credentials retrieved from the test data. After entering the invalid username and password, it 
    *              asserts that the appropriate error message is displayed, ensuring proper handling of invalid login attempts.
    * @returns {void} - This method does not return a value but performs assertions to validate the test.
    */
  performLoginWithInvalidCredentials() {
    const username = invalidLoginData.InvalidUserName;
    const password = invalidLoginData.InvalidPassword;

    cy.xpath(this.admin).should("be.visible").click();
    cy.xpath(this.logout).should("be.visible").click();

    // Fill username
    cy.xpath(this.user).clear().type(username);

    // Fill password
    cy.xpath(this.pass).clear().type(password);

    // Click sign-in button
    cy.xpath(this.signIn).click();

    cy.xpath(this.errorMsg).should("be.visible");
  }
}

export default LoginPage;
