# Contributing to Appium Desktop

There are a lot of different ways to contribute to Appium Desktop. See below to
learn more about how Appium Desktop is developed and for everything you can do
and the processes to follow for each contribution method.  Note that no matter
how you contribute, your participation is governed by our [Code of
Conduct](CONDUCT.md).

## Overview

Appium Desktop is an [Electron](http://electron.atom.io) app. Electron apps
have a basic architecture that consists of a _main_ process (which runs
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
0. Install dependencies (`npm install`)

### Doing Development

There is a handy script for preparing the code and launching a development version of the app:

```bash
npm run dev
```

This launches both the app and a development server which feeds UI code changes to the app as you make them (this is called 'hot reload'). In most cases, if you're simply making UI changes, you won't need to relaunch the app in order to see them reflected. If you do, simply kill this script and start again.

Another important thing to do before committing is to run a lint tool on your code:

```bash
npm run lint
```

Finally, you might want to run the app in a non-development mode in order to make sure that everything works as expected if you were to publish:

```bash
npm run build  # prepare resources
npm start  # start a production version of the app
```

### Running tests

To run unit tests, run the command

```bash
npm test
```

Before running e2e tests, run the command

```bash
npm run package-e2e-test
```

This will create builds in the `release/` folder that are specific for e2e testing. This only needs to be run whenever you make changes to the application.

To run the e2e tests call 

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

To package the app for your platform, run:

```bash
npm run package
```

To package the app for _all_ platforms, run:

```bash
npm run package-all
```

This will build the apps with the latest version of electron and put the various app packages in `release/`.

```bash
npm version <VERSION_TYPE>
```

This will increment the version and push a new tag. This will trigger AppVeyor and Travis CI to run a CI
build process and then publish the assets (.dmg, .exe, .AppImage) to GitHub releases which will contain a
draft of the new release.

Appium Desktop follows the same npm versioning workflow but isn't published to NPM.

* [Travis CI dashboard](https://travis-ci.org/appium/appium-desktop/)
* [AppVeyor dashboard](https://ci.appveyor.com/project/appium/appium-desktop)

## Submitting changes to the Appium Desktop code or docs

Fork the project, make a change, and send a pull request! Please have a look at
our [Style Guide](https://github.com/appium/appium/blob/master/docs/en/contributing-to-appium/style-guide-2.0.md) before
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
