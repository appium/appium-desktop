import * as Sentry from '@sentry/electron';
import settings from 'electron-settings';
import version from '../../sentry-version';

export async function initSentry () {
  // Enable Sentry crash report logging
  if (await settings.get('SENTRY_PERMISSION_ALLOWED')) {
    Sentry.init({
      release: version,
      dsn: 'https://257ba0d06bae49d183c8612c137b41f7@sentry.io/1363327',
    });
  }
}