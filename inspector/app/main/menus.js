import { app, shell, dialog, Menu } from 'electron';
import { checkNewUpdates } from './auto-updater';
import config from '../configs/app.config';
import i18n from '../configs/i18next.config';
import { rebuildMenus as _rebuildMenus } from '../../../shared/menus';

export function rebuildMenus (mainWindow) {
  _rebuildMenus({mainWindow, config, Menu, dialog, i18n, app, checkNewUpdates, extraMacMenus: [], shell});
}
