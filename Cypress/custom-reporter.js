const fs = require('fs-extra');
const xmlBuilder = require('xmlbuilder');
const axios = require('axios');

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

        if (fs.existsSync('./test.txt')) {
            fs.unlinkSync('./test.txt');
            console.log('Cleared existing test.txt file.');
        }
    }

    async logTestResult(test, status, error) {
        const testNameArray = test.title;
        const testName = Array.isArray(testNameArray) ? testNameArray.join(' - ') : testNameArray;

        if (typeof testName !== 'string') {
            console.error('Test title is not a valid string:', testName);
            return;
        }

        const fileName = testName.split(' ')[1]?.toLowerCase() || 'boundary'; // Default to 'boundary'

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

        const testCaseResultsString = JSON.stringify({ [GUID]: testCaseResult });

        const testResults = {
            testCaseResults: testCaseResultsString,
            customData: this.customData,
        };

        const finalResult = JSON.stringify(testResults, null, 2);
        fs.appendFileSync('./test.txt', `${finalResult}\n`);

        const fileOutput = `${this.camelCase(testName)}=${status === 'passed'}`;
        const outputFile = this.outputFiles[fileName] || './output_boundary_revised.txt';
        fs.appendFileSync(outputFile, `${fileOutput}\n`);
        console.log(`Written to file: ${outputFile} with content: ${fileOutput}`);

        this.prepareXmlFile(test, resultStatus);

        try {
            await this.sendDataToServer(testResults);
        } catch (error) {
            console.error('Error sending test results:', error);
        }
    }

    async sendDataToServer(testResults) {
        console.log('Preparing to send below data to server...');
        console.log(testResults);

        const url =
            'https://yaksha-prod-sbfn.azurewebsites.net/api/YakshaMFAEnqueue?code=jSTWTxtQ8kZgQ5FC0oLgoSgZG7UoU9Asnmxgp6hLLvYId/GW9ccoLw==';

        try {
            const response = await axios
                .post(url, testResults, {
                    headers: { 'Content-Type': 'application/json' },
                });
            console.log('Successfully sent data to the server.');
            console.log('Response Data:', response.data);
            console.log('Response Status:', response.status);
            return await new Promise((resolve) => {
                // console.log('Waiting for 10 seconds...');
                setTimeout(() => {
                    // console.log('Waited 10 seconds. Proceeding...');
                    resolve(response.data);
                }, 10000); // 10 seconds
            });
        } catch (error) {
            console.error('Error sending data to the server.');
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
            } else {
                console.error('Error Message:', error.message);
            }
            throw error;
        }
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

    async onEnd() {
        if (this.xml) {
            fs.writeFileSync(this.outputFiles.xml, this.xml.toString({ pretty: true }));
            console.log('XML file written:', this.outputFiles.xml);
        }

        const finalResults = {
            testCaseResults: fs.readFileSync('./test.txt', 'utf8'),
            customData: this.customData,
        };

        // try {
        //   await this.sendDataToServer(finalResults);
        // } catch (error) {
        //   console.error('Error sending final results:', error);
        // }

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