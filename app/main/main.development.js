import { app, BrowserWindow, Menu } from 'electron';
import { initializeIpc } from './appium';
import menuTemplates from './menus';
import path from 'path';

let menu;
let template;
let mainWindow = null;
const isDev = process.env.NODE_ENV === 'development';
const indexPath = path.resolve(__dirname, isDev ? '..' : 'app');


if (isDev) {
  require('electron-debug')(); // eslint-disable-line global-require
}


app.on('window-all-closed', () => {
  app.quit();
});


const installExtensions = async () => {
  if (isDev) {
    const installer = require('electron-devtools-installer'); // eslint-disable-line global-require
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ];
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload);
      } catch (e) {} // eslint-disable-line
    }
  }
};

app.on('ready', async () => {
  await installExtensions();

  mainWindow = new BrowserWindow({
    show: false,
    width: isDev ? 1200 : 650,
    height: 600,
    minWidth: 650,
    minHeight: 600,
  });

  mainWindow.loadURL(`file://${indexPath}/renderer/index.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.openDevTools();
  }

  mainWindow.webContents.on('context-menu', (e, props) => {
    const {x, y} = props;

    Menu.buildFromTemplate([{
      label: 'Inspect element',
      click () {
        mainWindow.inspectElement(x, y);
      }
    }]).popup(mainWindow);
  });

  if (process.platform === 'darwin') {
    template = menuTemplates.mac(mainWindow);
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    template = menuTemplates.other(mainWindow);
    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }

  initializeIpc(mainWindow);
});

