// Cut-and-paste from FBJS scripts
/*eslint-disable max-len*/
'use strict';

var fs = require('fs');
var assert = require('assert');
var exec = require('child_process').exec;
var semver = require('semver');
var f = require('util').format;

// Make sure we have a package.json to parse. Take it as the first argument
// (actually the 3rd for argv).
assert(
  process.argv.length >= 3,
  'Expected to receive a package.json file argument to parse'
);

var packageFilePath = process.argv[2];
var packageData;
try {
  var packageFile = fs.readFileSync(packageFilePath, {encoding: 'utf-8'});
  packageData = JSON.parse(packageFile);
} catch (e) {
  assert(
    false,
    f('Expected to be able to parse %s as JSON but we got this error instead: %s', packageFilePath, e)
  );
}

var enginesKey = process.argv[3] === '--dev' ? 'devEngines' : 'engines';

var engines = packageData[enginesKey];

if (engines.node !== undefined) {
  // First check that engines are valid semver
  assert(
    semver.validRange(engines.node),
    f('engines.node (%s) is not a valid semver range', engines.node)
  );
  // Then actually check that our version satisfies
  var nodeVersion = process.versions.node;
  assert(
    semver.satisfies(nodeVersion, engines.node),
    f('Current node version is not supported for development, expected "%s" to satisfy "%s".', nodeVersion, engines.node)
  );
}

if (engines.npm !== undefined) {
  // First check that engines are valid semver
  assert(
    semver.validRange(engines.npm),
    f('engines.npm (%s) is not a valid semver range', engines.npm)
  );

  // Then actually check that our version satisfies
  exec('npm --version', function(err, stdout, stderr) {
    assert(err === null, f('Failed to get npm version... %s'), stderr);

    var npmVersion = stdout.trim();
    assert(
      semver.satisfies(npmVersion, engines.npm),
      f('Current npm version is not supported for development, expected "%s" to satisfy "%s".', npmVersion, engines.npm)
    );
  });
}