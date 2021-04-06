import { app, shell, dialog, Menu } from 'electron';
import { createNewConfigWindow} from './appium';
import { checkNewUpdates } from './auto-updater';
import config from '../configs/app.config';
import i18n from '../configs/i18next.config';
import { rebuildMenus as _rebuildMenus } from '../../../shared/menus';

export function rebuildMenus (mainWindow) {
  const extraMacMenus = [{
    index: 0,
    menu: {
      label: i18n.t('Configurations…'),
      click () {
        createNewConfigWindow(mainWindow);
      }
    },
  }];

  _rebuildMenus({mainWindow, config, Menu, dialog, i18n, app, checkNewUpdates, extraMacMenus, shell});
}
