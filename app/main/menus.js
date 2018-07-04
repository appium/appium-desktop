import { app, shell, dialog } from 'electron';
import _ from 'lodash';
import { createNewSessionWindow } from './appium';
import { checkNewUpdates } from './auto-updater';
import CloudProvider from '../shared/cloud-providers';

let menuTemplates = {mac: {}, other: {}};

async function getCloudProvidersViewMenu () {
  const providers = CloudProvider.getProviders();
  const providersMenu = [];
  for (let provider of _.values(providers)) {
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

function macMenuAppium (mainWindow) {
  return {
    label: 'Appium',
    submenu: [{
      label: 'About Appium',
      selector: 'orderFrontStandardAboutPanel:'
    }, {
      label: 'Check for updates',
      click () {
        checkNewUpdates(true);
      }
    }, {
      type: 'separator'
    }, {
      label: 'New Session Window...',
      accelerator: 'Command+N',
      click () {
        createNewSessionWindow(mainWindow);
      }
    }, {
      type: 'separator'
    }, {
      label: 'Hide Appium',
      accelerator: 'Command+H',
      selector: 'hide:'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Shift+H',
      selector: 'hideOtherApplications:'
    }, {
      label: 'Show All',
      selector: 'unhideAllApplications:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click () {
        app.quit();
      }
    }]
  };
}

const macMenuEdit = {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'Command+Z',
    selector: 'undo:'
  }, {
    label: 'Redo',
    accelerator: 'Shift+Command+Z',
    selector: 'redo:'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'Command+X',
    selector: 'cut:'
  }, {
    label: 'Copy',
    accelerator: 'Command+C',
    selector: 'copy:'
  }, {
    label: 'Paste',
    accelerator: 'Command+V',
    selector: 'paste:'
  }, {
    label: 'Select All',
    accelerator: 'Command+A',
    selector: 'selectAll:'
  }]
};

async function macMenuView (mainWindow) {
  const submenu = (process.env.NODE_ENV === 'development') ? [{
    label: 'Reload',
    accelerator: 'Command+R',
    click () {
      mainWindow.webContents.reload();
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: 'Alt+Command+I',
    click () {
      mainWindow.toggleDevTools();
    }
  }] : [];

  submenu.push({
    label: 'Toggle Full Screen',
    accelerator: 'Ctrl+Command+F',
    click () {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  submenu.push({
    label: 'Cloud Providers',
    submenu: await getCloudProvidersViewMenu(),
  });

  return {
    label: 'View',
    submenu,
  };
}

const macMenuWindow = {
  label: 'Window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'Command+M',
    selector: 'performMiniaturize:'
  }, {
    label: 'Close',
    accelerator: 'Command+W',
    selector: 'performClose:'
  }, {
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    selector: 'arrangeInFront:'
  }]
};

const macMenuHelp = {
  label: 'Help',
  submenu: [{
    label: 'Learn More',
    click () {
      shell.openExternal('http://appium.io');
    }
  }, {
    label: 'Documentation',
    click () {
      shell.openExternal('https://appium.io/documentation.html');
    }
  }, {
    label: 'Search Issues',
    click () {
      shell.openExternal('https://github.com/appium/appium-desktop/issues');
    }
  }]
};

menuTemplates.mac = async (mainWindow) => [
  macMenuAppium(mainWindow),
  macMenuEdit,
  await macMenuView(mainWindow),
  macMenuWindow,
  macMenuHelp
];

function otherMenuFile (mainWindow) {
  let fileSubmenu = [{
    label: '&Open',
    accelerator: 'Ctrl+O'
  }, {
    label: '&About Appium',
    click () {
      dialog.showMessageBox({
        title: 'Appium Desktop',
        message: `Version ${app.getVersion()}`,
      });
    }
  }, {
    type: 'separator'
  }, {
    label: '&New Session Window...',
    accelerator: 'Ctrl+N',
    click () {
      createNewSessionWindow(mainWindow);
    }
  }, {
    label: '&Close',
    accelerator: 'Ctrl+W',
    click () {
      mainWindow.close();
    }
  }];

  // If it's Windows, add a 'Check for Updates' menu option
  if (process.platform === 'win32') {
    fileSubmenu.splice(1, 0, {
      label: '&Check for updates',
      click () {
        checkNewUpdates(true);
      }
    });
  }

  return {
    label: '&File',
    submenu: fileSubmenu,
  };
}

async function otherMenuView (mainWindow) {

  const submenu = [];
  submenu.push([{
    label: 'Toggle &Full Screen',
    accelerator: 'F11',
    click () {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  }]);

  submenu.push({
    label: 'Cloud Providers',
    submenu: await getCloudProvidersViewMenu(),
  });

  if (process.env.NODE_ENV === 'development') {
    submenu.push({
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click () {
        mainWindow.webContents.reload();
      }
    });
    submenu.push({
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click () {
        mainWindow.toggleDevTools();
      }
    });
  }

  return {
    label: '&View',
    submenu,
  };
}

const otherMenuHelp = {
  label: 'Help',
  submenu: [{
    label: 'Learn More',
    click () {
      shell.openExternal('http://appium.io');
    }
  }, {
    label: 'Documentation',
    click () {
      shell.openExternal('https://appium.io/documentation.html');
    }
  }, {
    label: 'Search Issues',
    click () {
      shell.openExternal('https://github.com/appium/appium-desktop/issues');
    }
  }]
};

menuTemplates.other = async (mainWindow) => [
  otherMenuFile(mainWindow),
  await otherMenuView(mainWindow),
  otherMenuHelp
];

export default menuTemplates;
