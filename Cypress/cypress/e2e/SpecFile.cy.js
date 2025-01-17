// Import the page object for interacting with elements
import LoginPage from "../PageObjects/Pages/LoginPage";
import AppointmentPage from "../PageObjects/Pages/AppointmentPage";
import ProcurementPage from "../PageObjects/Pages/ProcurementPage";
import DispensaryPage from "../PageObjects/Pages/DispensaryPage";
import LaboratoryPage from "../PageObjects/Pages/LaboratoryPage";
import RadiologyPage from "../PageObjects/Pages/RadiologyPage";
import UtilitiesPage from "../PageObjects/Pages/UtilitiesPage";
import PatientPage from "../PageObjects/Pages/PatientPage";
import ADTPage from "../PageObjects/Pages/ADTPage";
import SettingsPage from "../PageObjects/Pages/SettingsPage";

describe("Automation Suite for Yaksha Application", () => {
  // Create instance of the classes
  const login = new LoginPage();
  const appointment = new AppointmentPage();
  const procurement = new ProcurementPage();
  const utilPage = new UtilitiesPage();
  const dispensaryPage = new DispensaryPage();
  const laboratoryPage = new LaboratoryPage();
  const radiologyPage = new RadiologyPage();
  const patient = new PatientPage();
  const adt = new ADTPage();
  const settingsPage = new SettingsPage();

  // Set an acceptable load time in milliseconds
  const acceptableLoadTime = 1000;

  // Run before each test
  beforeEach(() => {
    cy.launchBrowser(); // Launch the browser
    cy.navigatingToBaseURL(); // Hit base URL

    // Login before each test
    login.performLogin();
    cy.wait(3000);

    // Verify login was successful
    verifyUserIsLoggedin();
  });

  it("TS-1 Verify Page Navigation and Load Time for Billing Counter", () => {
    utilPage.verifyBillingCounterLoadState();
    verifyUtilitiesURL("Utilities/ChangeBillingCounter");
  });

  it("TS-2 Verify Patient Search with Valid Data for appointment", () => {
    appointment.searchAndVerifypatientName();
    verifyPatientSearchHappened();
  });

  it("TS-3 Activate Counter in Dispensary", () => {
    dispensaryPage.verifyActiveCounterMessageInDispensary();
    verifyDispensaryCounterActivation();
  });

  it("TS-4 Purchase Request List Load", () => {
    procurement.verifyAllElementsVisible();
    verifyUserIsOnCorrectURL("ProcurementMain/PurchaseRequest/PurchaseRequestList");
  });

  it("TS-5 Lab Dashboard Data Validation", () => {
    laboratoryPage.verifyErrorMessage();
    checkErrorMessageOccurs();
  });

  it("TS-6 Handle Alert on Billing Counter", () => {
    radiologyPage.performRadiologyRequestAndHandleAlert();
    verifyUserIsOnCorrectURL("Radiology/ImagingRequisitionList");
  });

  it("TS-7 Verify Patient Search Functionality with Multiple Patients", () => {
    patient.searchAndVerifyPatients();
    verifyUserIsOnCorrectURL("Patient/SearchPatient");
  });

  it("TS-8 Error Handling and Logging in Purchase Request List", () => {
    procurement.verifyNoticeMessageAfterEnteringIncorrectFilters();
    verifyDateFilterErrorMessage();
  });

  it("TS-9 Modular Script for Patient Search", () => {
    appointment.searchPatientInAppointment();
    verifyPatientSearchHappened();
    patient.searchPatientInPatientPage()
    verifyPatientSearchHappened();
    adt.searchPatientInADT()
    verifyPatientSearchHappened();
  });

  it("TS-10 Verify 'Morning Counter' selection and report generation for the specified date", () => {
    dispensaryPage.generateMorningCounterReport();
    verifyReportGeneration();
  });

  it("TS-11 Verify 'New Visit' tab opens with Alt + N keyboard shortcut in Appointment Page", async () => {
    appointment.openNewVisitPageThroughKeyboardButton();
    verifyVisitPageOpens();
  });

  it("TS-12 Verify the tooltip text on hover of Star icon in Laboratory", () => {
    laboratoryPage.verifyStarTooltip();
    verifyUserIsOnCorrectURL("Lab/Dashboard");
  });

  it('TS-13 Add and Verify New Imaging Type in Radiology', () => {
    settingsPage.addAndVerifyNewImagingType();
    verifyImagingTypeAdded();
  });

  it("TS-14 Web Element Handling for Dropdowns in Purchase Request", () => {
    procurement.verifyRequestedDateColumnDateWithinRange();
    verifyPurchaseReqDataIsPresent();
  });

  it("TS-15 Login with invalid credentials", () => {
    login.performLoginWithInvalidCredentials();
    verifyUserIsNotLoggedin();
  });
});

// *****************Reusable functions starts from here*******************

function verifyUserIsLoggedin() {
  // Verify successful login by checking if 'admin' element is visible
  cy.xpath('//li[@class="dropdown dropdown-user"]', { timeout: 20000 })
    .should('be.visible')
    .then(() => {
      cy.log("User is successfully logged in.");
    });
}

function verifyPatientSearchHappened() {
  return cy
    .xpath(`//div[@role='gridcell' and @col-id='ShortName']`)
    .then((elements) => {
      if (elements.length === 1) {
        cy.log("Patient search happened");
      } else {
        throw new Error("Patient search didn't happen");
      }
    });
}

function verifyDispensaryCounterActivation() {
  return cy
    .xpath("//button[contains(text(),'Deactivate Counter')]")
    .should("be.visible");
}

function verifyUserIsOnCorrectURL(expectedURL) {
  cy.url().should("contain", expectedURL);
}

function verifyDispensaryPageURL(expectedURL) {
  cy.url().should("contain", expectedURL);
}

function verifyUtilitiesURL(expectedURL) {
  // cy.xpath("//span[text()='Utilities']")
  // .click()
  // .then(() => {
  // cy.xpath('//a[text()= " Change Billing Counter "]')
  // .click()
  // .then(() => {
  cy.url().should("contain", expectedURL);
  // });
  // });
}

function verifyPurchaseReqDataIsPresent() {
  return cy
    .xpath(`//div[@ref="eCenterContainer"]//div[@col-id="RequestDate"]`)
    .should("have.length.gte", 1);
}

function verifyUserIsNotLoggedin() {
  return cy
    .xpath('//div[contains(text(),"Invalid credentials !")]')
    .should("be.visible");
}

function checkErrorMessageOccurs() {
  cy.xpath('//button[contains(text(),"Close")]')
    .click()
    .then(() => {
      cy.url().should("contain", "Lab/Settings/LabTest");
    });
}

function verifyDateFilterErrorMessage() {
  // Locate the error message element
  cy.xpath('//div[contains(@class,"invalid-msg-cal")]')
    .should('be.visible') // Ensure the element is visible
    .invoke('text') // Get the text content of the error message
    .then((errorMessage) => {
      // Check that the error message matches the expected text
      expect(errorMessage.trim()).to.equal('Date is not between Range. Please enter again');
    });
}

function verifyImagingTypeAdded() {
  cy.url().should("contain", "Settings/RadiologyManage/ManageImagingType");
}

function verifyReportGeneration() {
  cy.get('div[col-id="CounterName"]').then(($elements) => {
    expect($elements.length).to.be.greaterThan(1);
  });
}

function verifyVisitPageOpens() {
  cy.get('h3.cstm-add-heading').should('be.visible');
}