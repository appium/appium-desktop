export function setupMainWindow ({mainWindow, mainUrl, isDev, Menu, i18n, rebuildMenus, settings, webContents}) {
  mainWindow.loadURL(mainUrl);

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
      label: i18n.t('Inspect element'),
      click () {
        mainWindow.inspectElement(x, y);
      }
    }]).popup(mainWindow);
  });

  i18n.on('languageChanged', async (languageCode) => {
    rebuildMenus();
    await settings.set('PREFERRED_LANGUAGE', languageCode);
    webContents.getAllWebContents().forEach((wc) => {
      wc.send('appium-language-changed', {
        language: languageCode,
      });
    });
  });

  rebuildMenus(mainWindow);
}
