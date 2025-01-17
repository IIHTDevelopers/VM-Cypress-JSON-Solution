class SettingsPage {
  
    constructor() {
      this.settingsLink = 'a[href="#/Settings"]';
      this.radiologySubmodule = '//a[@href="#/Settings/RadiologyManage" and contains(text(),"Radiology")]';
      this.addImagingTypeButton = '//a[text()="Add Imaging Type"]';
      this.imagingItemNameField = 'input#ImagingTypeName';
      this.addButton = 'input#addBtn';
      this.searchBar = 'input#quickFilterInput';
    }
  
    /**
     * @Test13 This method automates the process of creating a new imaging type in the Radiology section of the Settings module.
     *
     * @description This function performs the following actions:
     *              1. Navigates to the Settings module and clicks on the Radiology submodule.
     *              2. Clicks on the "Add Imaging Type" button to open the modal for adding a new imaging type.
     *              3. Fills the "Imaging Item Name" field with a random name (Test-{random4digitnumber}) and clicks "Add".
     *              4. Verifies that the newly added imaging type appears in the list of imaging types.
     */
    addAndVerifyNewImagingType() {
      // Navigate to Settings module and click on Radiology submodule
      cy.get(this.settingsLink).click();
      cy.xpath(this.radiologySubmodule).click();
      cy.wait(2000);
  
      // Click on Add Imaging Type button to open the modal
      cy.xpath(this.addImagingTypeButton).click();
  
      // Generate a random Imaging Item Name (Test-{random4digitnumber})
      const randomImagingName = `Test-${Math.floor(1000 + Math.random() * 9000)}`;
  
      // Fill the Imaging Item Name field and click Add
      cy.get(this.imagingItemNameField).type(randomImagingName);
      cy.get(this.addButton).click();
  
      // Wait for the new imaging type to appear in the list
      cy.wait(3000);
  
      // Search for the newly created Imaging Type
      cy.get(this.searchBar).clear().type(randomImagingName).type('{enter}');
      cy.wait(2000);
  
      // Verify the newly created Imaging Type is displayed in the list
      cy.xpath(`//div[text()="${randomImagingName}"]`).should('be.visible');
    }
  }
  
  export default SettingsPage;