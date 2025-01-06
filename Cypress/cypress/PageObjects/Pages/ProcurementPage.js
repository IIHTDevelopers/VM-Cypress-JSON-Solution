import dayjs from "dayjs";
import data from '../../e2e/Data/dateRange.json';

class ProcurementPage {

  constructor() {
    this.procurementXPath = '//a[@href="#/ProcurementMain"]';
    this.purchaseRequestXPath = '//a[contains(text(),"Purchase Request")]';
    this.purchaseOrderXPath = '(//a[contains(text(),"Purchase Order")])[1]';
    this.goodsArrivalNotificationXPath =
      '//a[contains(text(),"Goods Arrival Notification")]';
    this.quotationsXPath = '//a[contains(text(),"Quotation")]';
    this.settingsXPath = '//a[contains(text(),"Settings")]';
    this.reportsXPath = '//a[contains(text(),"Reports")]';
    this.favoriteButtonXPath = '//i[contains(@class,"icon-favourite")]';
    this.okButtonXPath = '//button[contains(text(),"OK")]';
    this.printButtonXPath = '//button[text()="Print"]';
    this.firstButtonXPath = '//button[text()="First"]';
    this.previousButtonXPath = '//button[text()="Previous"]';
    this.nextButtonXPath = '//button[text()="Next"]';
    this.lastButtonXPath = '//button[text()="Last"]';
    this.fromDateXPath = '(//input[@id="date"])[1]';
    this.toDateXPath = '(//input[@id="date"])[2]';
    this.invalidMsgXPath = '//div[contains(@class,"invalid-msg-cal")]';
    this.requestedDateColumnXPath =
      '//div[@col-id="RequestDate" and not(contains(@class,"ag-header-cell"))]';
  }
  procurement = "a[href='#/ProcurementMain']";
  purchaseRequestXPath = "//a[contains(text(),'Purchase Request')]";
  purchaseOrderXPath = "//a[contains(text(),'Purchase Order')]";
  goodsArrivalNotificationXPath =
    "//a[contains(text(),'Goods Arrival Notification')]";
  quotationsXPath = "//a[contains(text(),'Quotation')]";
  settingsXPath = "//a[contains(text(),'Settings')]";
  reportsXPath = "//a[contains(text(),'Reports')]";
  favoriteButtonXPath = "//i[contains(@class,'icon-favourite')]";
  okButtonXPath = "//button[contains(text(),'OK')]";
  printButtonXPath = "//button[text()='Print']";
  firstButtonXPath = "//button[text()='First']";
  previousButtonXPath = "//button[text()='Previous']";
  nextButtonXPath = "//button[text()='Next']";
  lastButtonXPath = "//button[text()='Last']";
  fromDateXPath = "(//input[@id='date'])[1]";
  toDateXPath = "(//input[@id='date'])[2]";
  invalidMsgXPath = "//div[contains(@class,'invalid-msg-cal')]";
  requestedDateColumnXPath = "div[col-id='RequestDate']";

  procurementDropdownClick() {
    return cy.get(this.procurement).should("be.visible").click();
  }

  purchaseRequest() {
    return cy.xpath(this.purchaseRequestXPath);
  }

  purchaseOrder() {
    return cy.xpath(this.purchaseOrderXPath);
  }

  goodsArrivalNotification() {
    return cy.xpath(this.goodsArrivalNotificationXPath);
  }

  quotations() {
    return cy.xpath(this.quotationsXPath);
  }

  settings() {
    return cy.xpath(this.settingsXPath);
  }

  reports() {
    return cy.xpath(this.reportsXPath);
  }

  favoriteButton() {
    return cy.xpath(this.favoriteButtonXPath);
  }

  okButton() {
    return cy.xpath(this.okButtonXPath);
  }

  printButton() {
    return cy.xpath(this.printButtonXPath);
  }

  firstButton() {
    return cy.xpath(this.firstButtonXPath);
  }

  previousButton() {
    return cy.xpath(this.previousButtonXPath);
  }

  nextButton() {
    return cy.xpath(this.nextButtonXPath);
  }

  lastButton() {
    return cy.xpath(this.lastButtonXPath);
  }

  fromDate() {
    return cy.xpath(this.fromDateXPath);
  }

  toDate() {
    return cy.xpath(this.toDateXPath);
  }

  invalidMsg() {
    return cy.xpath(this.invalidMsgXPath);
  }

  requestedDateColumn() {
    return cy.xpath(this.requestedDateColumnXPath);
  }

  /**
   * @Test4
   * @description Verifies the visibility of all elements in the procurement section.
   *              The method clicks on the procurement section, waits for it to load,
   *              and then checks the visibility of all the important UI elements
   *              like buttons, requests, notifications, and settings.
   * @returns {Cypress.Chainable<void>} - A Cypress chainable object for verification.
   */
  verifyAllElementsVisible() {
    cy.get(this.procurement).should("be.visible").click();
    cy.wait(2000);

    const elements = [
      this.purchaseRequest(),
      this.purchaseOrder(),
      this.goodsArrivalNotification(),
      this.quotations(),
      this.settings(),
      this.reports(),
      this.favoriteButton(),
      this.okButton(),
      this.printButton(),
      this.firstButton(),
      this.previousButton(),
      this.nextButton(),
      this.lastButton(),
    ];

    // Iterate over the elements and verify visibility
    elements.forEach((element) => {
      element.should("be.visible");
    });
  }

  /**
   * @Test8 This method verifies the error message displayed after entering incorrect filter values.
   *
   * @description This method navigates to the Procurement module and attempts to apply
   *              an invalid date filter. After clicking the OK button, it captures the displayed
   *              error message, which indicates that the entered date is invalid.
   */
  verifyNoticeMessageAfterEnteringIncorrectFilters() {
    cy.get(this.procurement).click();
    this.purchaseRequest().should("be.visible").click();
    const invalidDate = dayjs("0000-01-01").format("YYYY-MM-DD");
    this.fromDate()
      .should("be.visible")
      .clear()
      .type(invalidDate, { delay: 100 });

    // Verify the error message is shown
    this.invalidMsg()
      .should("be.visible")
      .invoke("text")
      .then((errorMessage) => {
        const actualErrorMessage = errorMessage.trim();
        cy.log(
          `----------------------------Invalid Error Message --->> ${actualErrorMessage}----------------------------`
        );
        expect(actualErrorMessage).to.contain(
          "Date is not between Range. Please enter again"
        );
      });
  }

  /**
   * @Test14 This method verifies that all dates in the requested date column are within the specified range.
   * @description Verifies that all dates in the "Requested Date" column are within a specified date range.
   *              It clicks through the procurement and purchase request sections, sets the date filters (from and to),
   *              and then checks if all dates in the table fall within the specified range.
   */
  verifyRequestedDateColumnDateWithinRange() {
    let allDatesInRange = true; // Flag to track whether all dates are within range

    const fromDate = data.FromDate;
    const toDate = data.ToDate;
    return cy
      .xpath(this.procurementXPath)
      .click()
      .then(() => {
        return cy.xpath(this.purchaseRequestXPath).click();
      })
      .then(() => {
        // Convert the from and to date to the correct format (YYYY-MM-DD) using dayjs
        const fromDateFormatted = dayjs(fromDate, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        );
        const toDateFormatted = dayjs(toDate, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        );

        // Type the formatted dates into the date inputs
        // Use both fromDateFormatted and toDateFormatted here
        cy.xpath(this.fromDateXPath).type(fromDateFormatted, { delay: 100 });
        cy.xpath(this.toDateXPath).type(toDateFormatted, { delay: 100 });

        // Click the 'OK' button
        return cy.xpath(this.okButtonXPath).click();
      })
      .then(() => {
        // Wait for the page to refresh or the data to be updated
        cy.wait(2000);
      })
      .then(() => {
        // Parse the input dates (starting from the beginning of the day)
        const fromDateParsed = dayjs(fromDate, "DD-MM-YYYY").startOf("day"); // Start of day for fromDate
        const toDateParsed = dayjs(toDate, "DD-MM-YYYY").startOf("day"); // Start of day for toDate

        const dateElementsToVerify = [];

        // Extract the requested dates from the page and compare them with the provided range
        return cy
          .xpath(this.requestedDateColumnXPath)
          .each(($el) => {
            const dateText = $el.text().trim();
            const [requestedDate] = dateText.split(" "); // Assuming the date is the first part of the text
            if (requestedDate) {
              dateElementsToVerify.push(requestedDate);
            }
          })
          .then(() => {
            return cy.wrap(dateElementsToVerify).each((dateStr) => {
              const requestedDateParsed = dayjs(dateStr, "YYYY-MM-DD").startOf(
                "day"
              );

              // Check if the requested date is within the specified range
              const isInRange =
                requestedDateParsed >= fromDateParsed &&
                requestedDateParsed <= toDateParsed;
              if (!isInRange) {
                cy.log(`Date out of range: ${dateStr}`);
              }
              if (!isInRange) {
                allDatesInRange = false;
              }
            });
          })
          .then(() => {
            return allDatesInRange; // Return the final result (true/false)
          });
      });
  }
}

export default ProcurementPage;
