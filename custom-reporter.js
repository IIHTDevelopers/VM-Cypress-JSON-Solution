const fs = require('fs');
const xmlBuilder = require('xmlbuilder');

let createXMLFile = true;
let customData = '';

// Define TestCaseResultDto class
class TestCaseResultDto {
    constructor() {
        this.methodName = '';
        this.methodType = '';
        this.actualScore = 0;
        this.earnedScore = 0;
        this.status = '';
        this.isMandatory = true;
        this.erroMessage = '';
    }
}

// Define TestResults class
class TestResults {
    constructor() {
        this.testCaseResults = '';
        this.customData = '';
    }
}

module.exports = (on) => {
    const outputFiles = {
        functional: './output_functional_revised.txt',
        boundary: './output_boundary_revised.txt',
        exception: './output_exception_revised.txt',
        xml: './yaksha-test-cases.xml',
    };

    // Clear old files at the start of the test run
    const clearOutputFiles = () => {
        for (const key in outputFiles) {
            if (fs.existsSync(outputFiles[key])) {
                fs.unlinkSync(outputFiles[key]);
                console.log(`Cleared existing file: ${outputFiles[key]}`);
            }
        }
    };

    // Write test results to files based on test case type
    const writeTestResults = (results) => {
        results.tests.forEach((test) => {
            const testCaseType = determineTestCaseType(test.title.join(' '));
            const outputFile = outputFiles[testCaseType] || outputFiles.boundary; // Default to boundary

            // Extract the test ID (e.g., TS-1) and format the title
            const match = test.title.join(' ').match(/(TS-\d+)\s(.+)/);
            let formattedTitle = '';

            if (match) {
                const [, testCaseId, testName] = match;
                formattedTitle = `${testCaseId}${camelCase(testName)}`;
            } else {
                // Fallback if the format is unexpected
                formattedTitle = camelCase(test.title.join(' '));
            }

            const fileOutput = `${formattedTitle}=${test.state === 'passed' ? 'Passed' : 'Failed'}\n`;

            // Append the formatted output to the appropriate file
            fs.appendFileSync(outputFile, fileOutput);
            console.log(`Written to file: ${outputFile} with content: ${fileOutput}`);
        });

        if (createXMLFile) {
            const xml = xmlBuilder.create('test-cases');
            results.tests.forEach((test) => prepareXmlFile(xml, test));
            fs.writeFileSync(outputFiles.xml, xml.toString({ pretty: true }));
            console.log('XML file created successfully.');
        }
    };

    // Determine test case type based on title
    const determineTestCaseType = (title) => {
        if (title.toLowerCase().includes('functional')) return 'functional';
        if (title.toLowerCase().includes('boundary')) return 'boundary';
        if (title.toLowerCase().includes('exception')) return 'exception';
        return 'boundary'; // Default case
    };

    // Prepare XML for a single test
    const prepareXmlFile = (xml, test) => {
        xml
            .ele('cases', {
                'xmlns:java': 'http://java.sun.com',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:type': 'java:com.assessment.data.TestCase',
            })
            .ele('test-case-type', determineTestCaseType(test.title.join(' ')))
            .up()
            .ele('expected-output', true)
            .up()
            .ele('name', camelCase(test.title.join(' ')))
            .up()
            .ele('weight', 2)
            .up()
            .ele('mandatory', true)
            .up()
            .ele('desc', 'na')
            .end();
    };

    // Utility function to convert string to camelCase
    const camelCase = (str) =>
        str
            .split(' ')
            .map((word, index) => (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)))
            .join('');

    // Cypress lifecycle events
    on('before:run', () => {
        console.log('Starting Cypress tests...');
        clearOutputFiles();
    });

    on('after:spec', (spec, results) => {
        console.log(`Finished spec: ${spec.relative}`);
        writeTestResults(results);
    });

    on('after:run', () => {
        console.log('Cypress test run completed.');
    });
};
