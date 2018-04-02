## [1.5.0](https://github.com/appium/appium-desktop/compare/v1.4.1...v1.5.0) (2018-04-02)

### Changes
* Feature: Allow unauthorized SSL and set custom proxy (#469)

## [1.4.1](https://github.com/appium/appium-desktop/compare/v1.4.0...v1.4.1) (2018-03-06)

### Changes
* Fix: Replace electron-builder autoupdater with Zeit Hazel server plus native updater (#435)


## [1.4.0](https://github.com/appium/appium-desktop/compare/v1.3.2...v1.4.0) (2018-02-27)

### Changes
* Feature: Add Headspin cloud to list of remote server types
* Feature: Add keyboard shortcut to clear terminal logs (#419)
* Fix: Fix Python recording error (#422)

## [1.3.2](https://github.com/appium/appium-desktop/compare/v1.3.1...v1.3.2) (2018-01-30)

### Changes
* Fix: Revert to Electron 1.7.11

## [1.3.1](https://github.com/appium/appium-desktop/compare/v1.3.0...v1.3.1) (2017-01-11)

### Changes
* Fix: Build error for 1.3.0 made XCUITestDriver unusable

## [1.3.0](https://github.com/appium/appium-desktop/compare/v1.2.7...v1.3.0) (2017-01-10)

### Changes
* Feature: Update Appium to 1.7.2
* Fix: Add linux category (#364)
* Fix: 'wd' recording code errors (#363)

## [1.2.7](https://github.com/appium/appium-desktop/compare/v1.2.6...v1.2.7) (2017-11-21)

### Changes
* Feature: Highlight elements that user searched for (#344)
* Fix: Remove element not found notification (#350)

## [1.2.6](https://github.com/appium/appium-desktop/compare/v1.2.5...v1.2.6) (2017-10-24)

### Changes
* Fix: Use multiple selector strategies if first one doesn't work (#330)
* Fix: Don't refresh page when element not found, send notification instead

## [1.2.5](https://github.com/appium/appium-desktop/compare/v1.2.4...v1.2.5) (2017-10-23)

### Changes
* Fix: Resolve python recorder errors (#323)
* Fix: Reload source when selected element is stale (#324)
* Fix: Debounce calls to selectElement (#325)

## [1.2.4](https://github.com/appium/appium-desktop/compare/v1.2.3...v1.2.4) (2017-10-14)

### Changes
* Fix: Change Appium version from 1.7.0 to 1.7.1


## [1.2.3](https://github.com/appium/appium-desktop/compare/v1.2.2...v1.2.3) (2017-09-26)

### Changes
* Feature: Upgrade to Appium version 1.7.1

## [1.2.2](https://github.com/appium/appium-desktop/compare/v1.2.1...v1.2.2) (2017-09-18)

### Changes
* Fix: Swipe SVG was obscured due to CSS (#300)

## [1.2.1](https://github.com/appium/appium-desktop/compare/v1.2.0...v1.2.1) (2017-09-13)

### Changes
* Fix: Show unknown platform if no platform found (#295)

### Changes
* Feature: Can run SauceConnect from user interface (#280)
* Feature: Can edit raw desired capabilities JSON string (#267)
* Feature: Add locator modal to search for elements and perform basic interactions on them (#244)
* Feature: Add interactive swipe and tap (#260)
* Feature: Add HTTPS option, and TO data center options (#262)
* Feature: Write raw logs to file that can be opened by user (#263)
* Fix: Added padding to bottom of source tree (#247)
* Fix: Make selected element card scrollable (#236)
* Fix: Limit number of rendered logs to 1000 (#263)

## [1.1.1](https://github.com/appium/appium-desktop/compare/v1.1.0...v1.1.1) (2017-07-27)

### Changes
* Fix: Scrolling in selected element card (#236)
* Fix: Recorder css and add docs for recorder

## [1.1.0](https://github.com/appium/appium-desktop/compare/v1.0.0...v1.1.0) (2017-07-24)

### Changes
* Feature: Can record actions in Java, JS, Python, and Ruby (#224)
* Feature: Updated to Appium 1.6.5 (#208)
* Feature: Show a list of currently running sessions when attaching sessions (#196)
* Fix: Draggable app area and window controls issues in Windows and Linux (#229)
* Fix: Resize inspector if it was previously too small (#225)
* Fix: Pegged ANTD version to prevent errors (#198) 

## [1.0.0](https://github.com/appium/appium-desktop/compare/v1.0.0-beta.6...v1.0.0) (2017-04-07)

### Changes
* Feature: Set Appium version to 1.6.4
* Fix: Filepath capabilities was being parsed as array, parses it to string 

## [1.0.0-beta.6](https://github.com/appium/appium-desktop/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2017-03-28)

### Changes
* Feature: When update fails to work automatically, show a link to the releases page
* Feature: Add a simple element finding recommendation to the element detail
* Fix: With logTimestamps set to `true`, server console timestamps would all update anytime a new one came in
* Fix: When opening up the app after an old version had been installed, any click would cause an error due to inability to read settings files correctly


## [1.0.0-beta.5](https://github.com/appium/appium-desktop/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2017-03-09)

### Changes
* Feature: When update complete, updater dialog asks user to close Appium instead of restarting it
* Feature: Updater dialog shows Linux users a link to releases page because Linux doesn't support autoupdates
* Fix: Windows waits 20 seconds after first run before checking for updates due to a timing issue with Squirrel.windows


## [1.0.0-beta.4](https://github.com/appium/appium-desktop/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2017-03-09)

### Changes
* Feature: add logging to autoUpdater ([#74](https://github.com/appium/appium-desktop/issues/74))
* Fix: improved markup and CSS in update window ([#74](https://github.com/appium/appium-desktop/issues/74))
* Fix: when an update is found, pulls release notes from GitHub API and displays them in the update window textarea


## [1.0.0-beta.3](https://github.com/appium/appium-desktop/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2017-03-09)

### Changes

* Feature: add "Attach to Session" tab on New Session window that allows attaching to an already-running session
* Fix: make 'connectHardwareKeyboard' capability true by default so that sims are interactable via the hardware keyboard when running under an Inspector session ([#61](https://github.com/appium/appium-desktop/issues/61))

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
