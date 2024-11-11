class HomePage {
  registeredPatientText(name) {
    return `//p[normalize-space() = '${name}']`;
  }

  verifyRegisteredPatientText() {
    cy.xpath(this.registeredPatientText("Registered Patient")).should(
      "be.visible"
    );
  }
}
export default HomePage;
