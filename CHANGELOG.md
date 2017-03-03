## [1.0.0-beta.2](https://github.com/appium/appium-desktop/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2017-03-02)

### Changes

* Fix: issue where typing into a desired capability box was prevented if the app had not been used before. ([#57](https://github.com/appium/appium-desktop/issues/57))


## [1.0.0-beta.1](https://github.com/appium/appium-desktop/compare/v1.0.0-beta...v1.0.0-beta.1) (2017-03-02)

### Changes

* Fix: shell environment was not loaded so drivers dependent on shell path or environment variables could not function ([#45](https://github.com/appium/appium-desktop/issues/45))
* Fix: some persistent settings keys were not given defaults and caused issues e.g. saving presets ([#52](https://github.com/appium/appium-desktop/issues/52))

## [1.0.0-beta](https://github.com/appium/appium-desktop/compare/e583bf1f7da6436e5b09747644700b1d19d66f1e...v1.0.0-beta) (2017-02-28)

### Features

* Appium GUI application written in Electron, React and Redux
* Includes Appium 1.6.4-beta as a dependency
* Runs an  Appium Server with user-specified settings
* Creates new Appium sessions with user-provided desiredCapabilities
* Can use SauceLabs, TestObject or any other arbitrary remote server to run Appium sessions
* Has an inspector window that allows the user to look at a screenshot and source of a running session
* Can select elements in the source and inspect their attributes
* Can call tap and sendKeys on elements
