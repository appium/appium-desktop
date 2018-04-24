/**
 * The latest versions of electron-builder has issues on Mac (see https://github.com/appium/appium-desktop/search?q=PrivateHeaders&type=Issues&utf8=%E2%9C%93)
 * 
 * Make Mac install 13 (the last known working version) and allow the other platforms (Win32, Linux) to keep using latest electron-builder
 */

let exec = require('teen_process').exec;

if (process.platform.toLowerCase() === 'darwin') {
  exec('npm', ['install', 'electron-builder@13']);
}