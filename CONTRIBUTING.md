# Contributing to Appium Desktop

There are a lot of different ways to contribute to Appium Desktop. See below to
learn more about how Appium Desktop is developed and for everything you can do
and the processes to follow for each contribution method.  Note that no matter
how you contribute, your participation is governed by our [Code of
Conduct](CONDUCT.md).

## Overview

Appium Desktop is a set of [Electron](http://electron.atom.io) apps. Electron
apps have a basic architecture that consists of a _main_ process (which runs
Node.js) and possibly many _renderer_ processes (essentially browser windows
which display HTML/CSS and can run JS---this is where the UI lives).
Interactions between the two types of process are made possible by a built-in
interprocess communication (IPC) mechanism.

For the UI, Appium Desktop is built using
[React](https://facebook.github.io/react/) and [Redux](http://redux.js.org) for
managing UI state and interactions, with [Ant
Design](https://ant.design/docs/react/introduce) for various UI components.

Why did we decide to go this route?

* Electron bundles apps for any platform
* Appium is written in JS so it's a nice way to stick with that as the main language; we can rely on Appium's community to maintain this app and follow Appium's coding standards
* Using web technologies to build a UI is a skill that many people have, whereas building native UIs is more esoteric
* Because Electron's main process runs in Node, we can import Appium as a strict dependency rather than be forced to manage it as a subprocess. This is great for speed and error handling
* It's fun!

Credits where credit is due: for the project's tooling, we started with
[electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate),
which comes with an excellent set of helpers scripts, many of which we still
use in an unmodified fashion. Many thanks to that project!

### Setting up

0. Clone the repo
0. Install global dependencies (`npm install`)
0. Install server GUI dependencies (`cd server && npm install`)
0. Install inspector dependencies (`cd inspector && npm install`)

### Doing Development

There is a handy script for preparing the code and launching a development
version of the apps, which you can run in either the `server` or `inspector`
directory based on which app you want to use:

```bash
npm run dev
```

This launches both the app and a development server which feeds UI code changes to the app as you make them (this is called 'hot reload'). In most cases, if you're simply making UI changes, you won't need to relaunch the app in order to see them reflected. If you do, simply kill this script and start again.

Another important thing to do before committing is to run a lint tool on your
code (you can do this from the main directory or one of the app directories):

```bash
npm run test:lint
```

Finally, you might want to run the app in a non-development mode in order to make sure that everything works as expected if you were to publish (run these from within `server` or `inspector` as appropriate):

```bash
npm run build  # prepare resources
npm start  # start a production version of the app
```

### Running tests

To run unit tests for an app, run the command

```bash
npm test
```

To run the e2e tests call:

```bash
npm run e2e
```

### Debugging

#### Renderer
* The renderer uses Chromium and can be debugged using Chrome DevTools the same way a webpage is debugged
* When you run dev (`npm run dev`) the Chrome DevTools window is opened on startup.
* To open it again, after it has been closed, right click on the window and select `Inspect Element`

#### Main
* In Chrome Dev Tools
  * Run dev (`npm run dev`). This sets an --inspect port at 5858
  * Running in dev sets up an inspector port at 5858
  * Open chrome://inspect in your chrome browser
  * Click `Open dedicated DevTools for Node`
  * Add a connection `localhost:5858`
  * Start inspecting code under other tabs
* In VSCode
  * In the debug tab, run 'dev'
  * Set breakpoints directly in VSCode
* For reference on NodeJS debugging see:
  * https://electronjs.org/docs/tutorial/debugging-main-process-vscode
  * https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27


### Packaging and Releasing

Appium Desktop uses [Electron Builder](https://github.com/electron-userland/electron-builder/) to build app. Read this document for instructions on how to set up your local environment so that you can build and package the app: https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build

To package the app for your platform, locally, run this command from within one of the app directories:

```bash
npx electron-builder build --publish never
```

This will build the app and save the assets to `release/` within the appropriate app directory.

Appium Desktop is published to Github Releases (at http://github.com/appium/appium-desktop/releases). Packaging and releasing gets triggered when a git tag is committed and the CI creates the assets for all platforms and uploads them. The changelog needs to be written manually.

## Submitting changes to the Appium Desktop code or docs

Fork the project, make a change, and send a pull request! Please have a look at
our [Style Guide](https://github.com/appium/appium/blob/master/docs/en/contributing-to-appium/style-guide.md) before
getting to work.  Please make sure functional tests pass before
sending a pull request; for more information on how to run tests, keep reading!

Make sure you read and follow the setup instructions in the README first. And note
that all participation in the Appium community (including code submissions) is
governed by our [Code of Conduct](CONDUCT.md).

Finally, before we accept your code, you will need to have signed our Contributor License Agreement.
Instructions will be given by the GitHub Bot when you make a pull request.

### Submit bug reports or feature requests

Just use the GitHub issue tracker to submit your bug reports and feature
requests. If you are submitting a bug report, please follow the [issue template](https://github.com/appium/appium-desktop/issues/new).

### Localization

Appium Desktop uses [i18next](https://www.i18next.com) library to manage its translations. All translatable resources are stored in `assets/locales/en/translation.json` file. The list of supported languages can be found (or altered) in `app/configs/app.config.js` module. Please read through i18next API documentation to get more information on how to manage the localized resources:

- https://i18next.github.io/i18next/pages/doc_features.html
- https://www.i18next.com/translation-function/essentials
- https://www.i18next.com/translation-function/interpolation
- https://www.i18next.com/translation-function/formatting
- https://www.i18next.com/translation-function/plurals
- https://react.i18next.com/legacy-v9/trans-component

Please only edit the resources for the English language since the other languages are managed by the external Translation Management Service and should only be changed by automated scripts. The `npm run crowdin-update` command updates the original translations in the translation management service (https://crowdin.com/project/appium-desktop). The `npm run crowdin-sync` command synchronizes the translated files with the translation management service. The update script is executed upon each merge to master branch and the sync script is executed each week on a scheduled basis.
