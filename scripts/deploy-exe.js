/* eslint-disable no-console */
var token = process.env.GITHUB_REPO_TOKEN;
var tag = process.env.APPVEYOR_REPO_TAG_NAME;
var fs = require('fs');
var filename = 'Appium Setup :tag.exe'.replace(':tag', tag);
var github = require('octonode');
var _ = require('lodash');

if (!tag) {
  console.log('Not deploying windows exe because it\'s not a tag');
  process.exit(0);
}

// Get the client
var client = github.client(token);
var appiumDesktopRepo = client.repo('dpgraham/appium-desktop');

// Get existing releases
appiumDesktopRepo.releases(function (err, releases) {
  if (err) {
    console.error('Could not get releases', err);
    process.exit(1);
  }
  // Find the release that matches the given tag
  releases = _.keyBy(releases, 'tag_name');
  var release = releases[tag];
  if (!release) {
    console.error('Could not find release at: ' + tag);
    process.exit(0);
  }

  // Upload the .exe to the release
  release = client.release('dpgraham/appium-desktop', release.id);
  release.uploadAssets(fs.readFileSync('release/:filename'.replace(':filename', filename)), {
    name: filename,
    contentType: 'application/x-msdownload',
    uploadHost: 'uploads.github.com',
  }, function (err) {
    if (err) {
      if (err.body.errors && err.body.errors[0].code !== 'already_exists') {
        console.log('Could not upload exe', err.body.errors);
        process.exit(1);
      } else {
        console.warn('Could not uplaod .exe. Already uploaded');
      }
    } else {
      console.log('Uploaded :filename to :tag'.replace(':filename', filename).replace(':tag', tag));
    }
    process.exit(0);
  });
});