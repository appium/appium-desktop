const { logger } = require('appium-support');
const request = require('request');
const path = require('path');
const { createReadStream } = require('fs');

const log = logger.getLogger('CROWDIN');

const PROJECT_ID = process.env.CROWDIN_PROJECT_ID;
const PROJECT_KEY = process.env.CROWDIN_PROJECT_KEY;
if (!PROJECT_ID || !PROJECT_KEY) {
  throw new Error(`Both CROWDIN_PROJECT_ID and CROWDIN_PROJECT_KEY environment ` +
    `variables must be set`);
}
const resourcePath = path.resolve('assets', 'locales', 'en', 'translation.json');
const fieldName = `files[/${path.basename(resourcePath)}]`;

const options = {
  url: `https://api.crowdin.com/api/project/${PROJECT_ID}/update-file?key=${PROJECT_KEY}`,
  port: 443,
  method: 'POST',
  headers: {
    'User-Agent': 'Appium Desktop',
  },
  formData: {
    [fieldName]: createReadStream(resourcePath)
  }
};

// eslint-disable-next-line promise/prefer-await-to-callbacks
request(options, (err, res, body) => {
  if (err) {
    throw err;
  }

  log.debug(`Response code: ${res.statusCode}`);
  if (res.statusCode >= 400) {
    throw new Error(JSON.stringify(body));
  }
});
