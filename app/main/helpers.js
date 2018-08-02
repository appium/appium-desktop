import { BrowserWindow, Menu } from 'electron';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

export function openBrowserWindow (route, opts) {
  const defaultOpts = {
    width: 1080,
    minWidth: 1080,
    height: 570,
    minHeight: 570,
    backgroundColor: "#f2f2f2",
    frame: "customButtonsOnHover",
    webPreferences: {
      devTools: true
    }
  };

  let win = new BrowserWindow({
    ...defaultOpts,
    ...opts,
  });

  // note that __dirname changes based on whether we're in dev or prod;
  // in dev it's the actual dirname of the file, in prod it's the root
  // of the project (where main.js is built), so switch accordingly
  let htmlPath = path.resolve(__dirname,  isDev ? '..' : 'app', 'renderer', 'index.html');
  
  // on Windows we'll get backslashes, but we don't want these for a browser URL, so replace
  htmlPath = htmlPath.replace("\\", "/");
  htmlPath += `#/${route}`;
  win.loadURL(`file://${htmlPath}`);
  win.show();

  // If it's dev, go ahead and open up the dev tools automatically
  if (isDev) {
    win.openDevTools();
  }

  // Make 'devTools' available on right click
  win.webContents.on('context-menu', (e, props) => {
    const {x, y} = props;

    Menu.buildFromTemplate([{
      label: 'Inspect element',
      click () {
        win.inspectElement(x, y);
      }
    }]).popup(win);
  });

  return win;
}