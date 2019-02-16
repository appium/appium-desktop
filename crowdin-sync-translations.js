const { logger, tempDir, fs, zip } = require('appium-support');
const request = require('request');
const path = require('path');
const { createWriteStream } = require('fs');
const B = require('bluebird');
const { asyncify } = require('asyncbox');

const log = logger.getLogger('CROWDIN');

const PROJECT_ID = process.env.CROWDIN_PROJECT_ID;
const PROJECT_KEY = process.env.CROWDIN_PROJECT_KEY;
if (!PROJECT_ID || !PROJECT_KEY) {
  throw new Error(`Both CROWDIN_PROJECT_ID and CROWDIN_PROJECT_KEY environment ` +
    `variables must be set`);
}
const RESOURCES_ROOT = path.resolve('assets', 'locales');
const ORIGINAL_LANGUAGE = 'en';

async function main () {
  const zipPath = await tempDir.path({prefix: 'translations', suffix: '.zip'});
  try {
    const options = {
      url: `https://api.crowdin.com/api/project/${PROJECT_ID}/download/all.zip?key=${PROJECT_KEY}`,
      port: 443,
      method: 'GET',
      headers: {
        'User-Agent': 'Appium Desktop',
      },
    };
    await new B((resolve, reject) => {
      request(options)
        .on('error', reject)
        .on('response', (res) => {
          log.debug(`Response code: ${res.statusCode}`);
          if (res.statusCode >= 400) {
            return reject(`Error downloading file: ${res.statusCode}`);
          }
        })
        .pipe(createWriteStream(zipPath))
        .on('close', resolve);
    });

    const tmpRoot = await tempDir.openDir();
    try {
      await zip.extractAllTo(zipPath, tmpRoot);
      for (const name of await fs.readdir(tmpRoot)) {
        const currentPath = path.join(tmpRoot, name);
        if (!(await fs.stat(currentPath)).isDirectory() || name === ORIGINAL_LANGUAGE) {
          continue;
        }

        await fs.mv(currentPath, path.resolve(RESOURCES_ROOT, name), {
          mkdirp: true
        });
        log.info(`Updated resources for the '${name}' language`);
      }
    } finally {
      await fs.rimraf(tmpRoot);
    }
  } finally {
    await fs.rimraf(zipPath);
  }
}

asyncify(main);