import { app, shell, dialog, Menu } from 'electron';
import _ from 'lodash';
import { createNewSessionWindow, createNewConfigWindow} from './appium';
import { checkNewUpdates } from './auto-updater';
import CloudProviders from '../shared/cloud-providers';
import config from '../configs/app.config';
import i18n from '../configs/i18next.config';

let menuTemplates = {mac: {}, other: {}};
let mainWindow = null;

async function getCloudProvidersViewMenu () {
  const providersMenu = [];
  for (let provider of _.values(CloudProviders)) {
    providersMenu.push({
      label: provider.label,
      type: 'checkbox',
      checked: await provider.isVisible(),
      click (menuItem) {
        provider.setVisible(menuItem.checked);
      },
    });
  }
  return providersMenu;
}

function languageMenu () {
  return config.languages.map((languageCode) => ({
    label: i18n.t(languageCode),
    type: 'radio',
    checked: i18n.language === languageCode,
    click: () => i18n.changeLanguage(languageCode)
  }));
}

function macMenuAppium () {
  return {
    label: 'Appium',
    submenu: [{
      label: i18n.t('About Appium'),
      selector: 'orderFrontStandardAboutPanel:'
    }, {
      label: i18n.t('Check for updates'),
      click () {
        checkNewUpdates(true);
      }
    }, {
      type: 'separator'
    }, {
      label: i18n.t('New Session Window…'),
      accelerator: 'Command+N',
      click () {
        createNewSessionWindow(mainWindow);
      }
    }, {
      label: i18n.t('Configurations…'),
      click () {
        createNewConfigWindow(mainWindow);
      }
    }, {
      type: 'separator'
    }, {
      label: i18n.t('Hide Appium'),
      accelerator: 'Command+H',
      selector: 'hide:'
    }, {
      label: i18n.t('Hide Others'),
      accelerator: 'Command+Shift+H',
      selector: 'hideOtherApplications:'
    }, {
      label: i18n.t('Show All'),
      selector: 'unhideAllApplications:'
    }, {
      type: 'separator'
    }, {
      label: i18n.t('Quit'),
      accelerator: 'Command+Q',
      click () {
        app.quit();
      }
    }]
  };
}

function macMenuEdit () {
  return {
    label: i18n.t('Edit'),
    submenu: [{
      label: i18n.t('Undo'),
      accelerator: 'Command+Z',
      selector: 'undo:'
    }, {
      label: i18n.t('Redo'),
      accelerator: 'Shift+Command+Z',
      selector: 'redo:'
    }, {
      type: 'separator'
    }, {
      label: i18n.t('Cut'),
      accelerator: 'Command+X',
      selector: 'cut:'
    }, {
      label: i18n.t('Copy'),
      accelerator: 'Command+C',
      selector: 'copy:'
    }, {
      label: i18n.t('Paste'),
      accelerator: 'Command+V',
      selector: 'paste:'
    }, {
      label: i18n.t('Select All'),
      accelerator: 'Command+A',
      selector: 'selectAll:'
    }]
  };
}

async function macMenuView () {
  const submenu = (process.env.NODE_ENV === 'development') ? [{
    label: i18n.t('Reload'),
    accelerator: 'Command+R',
    click () {
      mainWindow.webContents.reload();
    }
  }, {
    label: i18n.t('Toggle Developer Tools'),
    accelerator: 'Alt+Command+I',
    click () {
      mainWindow.toggleDevTools();
    }
  }] : [];

  submenu.push({
    label: i18n.t('Toggle Full Screen'),
    accelerator: 'Ctrl+Command+F',
    click () {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  submenu.push({
    label: i18n.t('Languages'),
    submenu: languageMenu(),
  });

  submenu.push({
    label: i18n.t('Cloud Providers'),
    submenu: await getCloudProvidersViewMenu(),
  });

  return {
    label: i18n.t('View'),
    submenu,
  };
}

function macMenuWindow () {
  return {
    label: i18n.t('Window'),
    submenu: [{
      label: i18n.t('Minimize'),
      accelerator: 'Command+M',
      selector: 'performMiniaturize:'
    }, {
      label: i18n.t('Close'),
      accelerator: 'Command+W',
      selector: 'performClose:'
    }, {
      type: 'separator'
    }, {
      label: i18n.t('Bring All to Front'),
      selector: 'arrangeInFront:'
    }]
  };
}

function macMenuHelp () {
  return {
    label: i18n.t('Help'),
    submenu: [{
      label: i18n.t('Learn More'),
      click () {
        shell.openExternal('http://appium.io');
      }
    }, {
      label: i18n.t('Documentation'),
      click () {
        shell.openExternal('https://appium.io/documentation.html');
      }
    }, {
      label: i18n.t('Search Issues'),
      click () {
        shell.openExternal('https://github.com/appium/appium-desktop/issues');
      }
    }]
  };
}

menuTemplates.mac = async () => [
  macMenuAppium(),
  macMenuEdit(),
  await macMenuView(),
  macMenuWindow(),
  macMenuHelp(),
];

function otherMenuFile () {
  let fileSubmenu = [{
    label: i18n.t('&Open'),
    accelerator: 'Ctrl+O'
  }, {
    label: i18n.t('&About Appium'),
    click () {
      dialog.showMessageBox({
        title: i18n.t('Appium Desktop'),
        message: i18n.t(`Version ${app.getVersion()}`),
      });
    }
  }, {
    type: 'separator'
  }, {
    label: i18n.t('&New Session Window...'),
    accelerator: 'Ctrl+N',
    click () {
      createNewSessionWindow(mainWindow);
    }
  }, {
    label: i18n.t('&Close'),
    accelerator: 'Ctrl+W',
    click () {
      mainWindow.close();
    }
  }];

  // If it's Windows, add a 'Check for Updates' menu option
  if (process.platform === 'win32') {
    fileSubmenu.splice(1, 0, {
      label: i18n.t('&Check for updates'),
      click () {
        checkNewUpdates(true);
      }
    });
  }

  return {
    label: i18n.t('&File'),
    submenu: fileSubmenu,
  };
}

async function otherMenuView () {
  const submenu = [];
  submenu.push([{
    label: i18n.t('Toggle &Full Screen'),
    accelerator: 'F11',
    click () {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  }]);

  submenu.push({
    label: i18n.t('Languages'),
    submenu: languageMenu(),
  });

  submenu.push({
    label: i18n.t('Cloud Providers'),
    submenu: await getCloudProvidersViewMenu(),
  });

  if (process.env.NODE_ENV === 'development') {
    submenu.push({
      label: i18n.t('&Reload'),
      accelerator: 'Ctrl+R',
      click () {
        mainWindow.webContents.reload();
      }
    });
    submenu.push({
      label: i18n.t('Toggle &Developer Tools'),
      accelerator: 'Alt+Ctrl+I',
      click () {
        mainWindow.toggleDevTools();
      }
    });
  }

  return {
    label: i18n.t('&View'),
    submenu,
  };
}

function otherMenuHelp () {
  return {
    label: i18n.t('Help'),
    submenu: [{
      label: 'Learn More',
      click () {
        shell.openExternal('http://appium.io');
      }
    }, {
      label: i18n.t('Documentation'),
      click () {
        shell.openExternal('https://appium.io/documentation.html');
      }
    }, {
      label: i18n.t('Search Issues'),
      click () {
        shell.openExternal('https://github.com/appium/appium-desktop/issues');
      }
    }]
  };
}

menuTemplates.other = async () => [
  otherMenuFile(mainWindow),
  await otherMenuView(mainWindow),
  otherMenuHelp()
];

async function rebuildMenus (mainWin = null) {
  if (mainWin) {
    mainWindow = mainWin;
  }
  if (!mainWindow) {
    return;
  }

  if (config.platform === 'darwin') {
    const template = await menuTemplates.mac(mainWindow);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    const template = await menuTemplates.other(mainWindow);
    const menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
}

export default rebuildMenus;
