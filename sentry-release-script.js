const { execSync } = require('child_process');
const { logger } = require('appium-support');

const log = logger.getLogger('SENTRY RELEASE');

// Executes 'sentry-cli' commands
function execSentry (cmd) {
  return execSync(`npx sentry-cli ${cmd}`, {encoding: 'utf8'});
}

try {
  // Get the Sentry recommended version
  let version = require('./sentry-version');

  // Create the version
  log.info(`Creating new Sentry release: ${version}`);
  execSentry(`releases new ${version}`);

  // Upload sourcemaps
  log.info(`Uploading sourcemaps`);
  execSentry(`releases files ${version} upload-sourcemaps ./dist`);

  // Finalize the release
  log.info(`Finalizing release`);
  execSentry(`releases finalize ${version}`);
  process.exit(0);
} catch (e) {
  log.error(`Could not create Sentry release. Reason: ${e.message}`);
  process.exit(1);
}