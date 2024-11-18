const fs = require('fs-extra');
const xmlBuilder = require('xmlbuilder');

class CypressCustomReporter {
  constructor() {
    this.xml = xmlBuilder.create('test-cases');
    this.outputFiles = {
      business: './output_revised.txt',
      boundary: './output_boundary_revised.txt',
      exception: './output_exception_revised.txt',
      xml: './yaksha-test-cases.xml',
    };

    this.customData = '';

    // Load custom data if available
    try {
      const data = fs.readFileSync('../../custom.ih', 'utf8');
      this.customData = data;
    } catch (err) {
      console.error('Error reading custom data:', err.message);
    }

    // Clear old output files
    this.clearOutputFiles();
  }

  clearOutputFiles() {
    Object.values(this.outputFiles).forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Cleared existing file: ${filePath}`);
      }
    });

    // Ensure `test.txt` is cleared
    if (fs.existsSync('./test.txt')) {
      fs.unlinkSync('./test.txt');
      console.log('Cleared existing test.txt file.');
    }
  }

  // logTestResult(test, status, error) {
  //   const testNameArray = test.title; // Get the test title array
  //   const testName = Array.isArray(testNameArray) ? testNameArray.join(' - ') : testNameArray;

  //   if (typeof testName !== 'string') {
  //     console.error('Test title is not a valid string:', testName);
  //     return;
  //   }

  //   const fileName = testName.split(' ')[1]?.toLowerCase() || 'boundary'; // Default to 'boundary'

  //   // Prepare result DTO
  //   const resultScore = status === 'passed' ? 1 : 0;
  //   const resultStatus = status === 'passed' ? 'Passed' : 'Failed';

  //   const testCaseResult = {
  //     methodName: this.camelCase(testName),
  //     methodType: 'boundary',
  //     actualScore: 1,
  //     earnedScore: resultScore,
  //     status: resultStatus,
  //     isMandatory: true,
  //     erroMessage: error || '',
  //   };

  //   const GUID = 'd907aa7b-3b6d-4940-8d09-28329ccbc070';
  //   const testResults = {
  //     testCaseResults: { [GUID]: testCaseResult },
  //     customData: this.customData,
  //   };

  //   // Write results to files
  //   const finalResult = JSON.stringify(testResults, null, 2);
  //   fs.appendFileSync('./test.txt', `${finalResult}\n`);

  //   const fileOutput = `${this.camelCase(testName)}=${status === 'passed'}`;
  //   const outputFile = this.outputFiles[fileName] || './output_boundary_revised.txt';
  //   fs.appendFileSync(outputFile, `${fileOutput}\n`);
  //   console.log(`Writing to file: ${outputFile} with content: ${fileOutput}`);

  //   // Add test details to XML
  //   this.prepareXmlFile(test, resultStatus);
  // }

  logTestResult(test, status, error) {
    const testNameArray = test.title; // Get the test title array
    const testName = Array.isArray(testNameArray) ? testNameArray.join(' - ') : testNameArray;

    if (typeof testName !== 'string') {
      console.error('Test title is not a valid string:', testName);
      return;
    }

    const fileName = testName.split(' ')[1]?.toLowerCase() || 'boundary'; // Default to 'boundary'

    // Prepare result DTO
    const resultScore = status === 'passed' ? 1 : 0;
    const resultStatus = status === 'passed' ? 'Passed' : 'Failed';

    const testCaseResult = {
      methodName: this.camelCase(testName),
      methodType: 'boundary',
      actualScore: 1,
      earnedScore: resultScore,
      status: resultStatus,
      isMandatory: true,
      erroMessage: error || '',
    };

    const GUID = 'd907aa7b-3b6d-4940-8d09-28329ccbc070';

    // Convert testCaseResults to a stringified object
    const testCaseResultsString = JSON.stringify({ [GUID]: testCaseResult });

    const testResults = {
      testCaseResults: testCaseResultsString, // Store as stringified JSON
      customData: this.customData,
    };

    // Write results to files
    const finalResult = JSON.stringify(testResults, null, 2);
    fs.appendFileSync('./test.txt', `${finalResult}\n`);

    const fileOutput = `${this.camelCase(testName)}=${status === 'passed'}`;
    const outputFile = this.outputFiles[fileName] || './output_boundary_revised.txt';
    fs.appendFileSync(outputFile, `${fileOutput}\n`);
    console.log(`Writing to file: ${outputFile} with content: ${fileOutput}`);

    // Add test details to XML
    this.prepareXmlFile(test, resultStatus);
  }

  sendDataToServer(testResults) {
    const XMLHttpRequest = require('xhr2');
    const xhr = new XMLHttpRequest();
    const url =
      'https://yaksha-prod-sbfn.azurewebsites.net/api/YakshaMFAEnqueue?code=jSTWTxtQ8kZgQ5FC0oLgoSgZG7UoU9Asnmxgp6hLLvYId/GW9ccoLw==';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Successfully sent data to the server:', xhr.responseText);
        } else {
          console.error('Failed to send data to the server:', xhr.status, xhr.statusText);
        }
      }
    };
    xhr.send(JSON.stringify(testResults));
  }

  prepareXmlFile(test, status) {
    const testNameArray = test.title;
    const testName = Array.isArray(testNameArray) ? testNameArray.join(' - ') : testNameArray;

    const testCaseType = testName.split(' ')[1]?.toLowerCase() || 'boundary';
    this.xml
      .ele('cases', {
        'xmlns:java': 'http://java.sun.com',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:type': 'java:com.assessment.data.TestCase',
      })
      .ele('test-case-type', this.capitalize(testCaseType))
      .up()
      .ele('expected-ouput', true)
      .up()
      .ele('name', this.camelCase(testName))
      .up()
      .ele('weight', 2)
      .up()
      .ele('mandatory', true)
      .up()
      .ele('desc', 'na')
      .end();
  }

  onEnd() {
    if (this.xml) {
      fs.writeFileSync(this.outputFiles.xml, this.xml.toString({ pretty: true }));
      console.log('XML file written:', this.outputFiles.xml);
    }
    console.log('Test suite completed.');
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  camelCase(str) {
    return str
      .split(' ')
      .map((word, index) => (index === 0 ? word.toLowerCase() : this.capitalize(word)))
      .join('');
  }
}

module.exports = CypressCustomReporter;
