import { app, shell } from 'electron';

let menuTemplates = {mac: {}, other: {}};

const macMenuAppium = {
  label: 'Appium',
  submenu: [{
    label: 'About Appium',
    selector: 'orderFrontStandardAboutPanel:'
  }, {
    type: 'separator'
  }, {
    label: 'Services',
    submenu: []
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

function macMenuView (mainWindow) {
  return {
    label: 'View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: 'Reload',
      accelerator: 'Command+R',
      click () {
        mainWindow.webContents.reload();
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: 'Alt+Command+I',
      click () {
        mainWindow.toggleDevTools();
      }
    }] : [{
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }]
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

menuTemplates.mac = (mainWindow) => [
  macMenuAppium,
  macMenuEdit,
  macMenuView(mainWindow),
  macMenuWindow,
  macMenuHelp
];

function otherMenuFile (mainWindow) {
  return {
    label: '&File',
    submenu: [{
      label: '&Open',
      accelerator: 'Ctrl+O'
    }, {
      label: '&Close',
      accelerator: 'Ctrl+W',
      click () {
        mainWindow.close();
      }
    }]
  };
}

function otherMenuView (mainWindow) {
  return {
    label: '&View',
    submenu: (process.env.NODE_ENV === 'development') ? [{
      label: '&Reload',
      accelerator: 'Ctrl+R',
      click () {
        mainWindow.webContents.reload();
      }
    }, {
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }, {
      label: 'Toggle &Developer Tools',
      accelerator: 'Alt+Ctrl+I',
      click () {
        mainWindow.toggleDevTools();
      }
    }] : [{
      label: 'Toggle &Full Screen',
      accelerator: 'F11',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
      }
    }]
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

menuTemplates.other = (mainWindow) => [
  otherMenuFile(mainWindow),
  otherMenuView(mainWindow),
  otherMenuHelp
];

export default menuTemplates;
