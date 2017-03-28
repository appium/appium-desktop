var execSync = require('child_process').execSync;
var rimraf = require('appium-support').fs.rimraf;
var fs = require('fs');

fs.writeFileSync('temp-cert.p12', process.env.CSC_LINK, {encoding: 'base64'});

execSync([
  'security import "./temp-cert.p12" -P ' + process.env.CSC_KEY_PASSWORD,
  'security find-identity -v',
].join(' '));

rimraf('temp-cert.p12');