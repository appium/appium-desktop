import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from './app.config';
import settings from '../shared/settings';
import path from 'path';
import i18nextBackend from 'i18next-node-fs-backend';

const i18nextOptions = {
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
    addPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
    jsonIndent: 2,
  },
  // debug: true,
  // saveMissing: true,
  interpolation: {
    escapeValue: false
  },
  lng: settings && settings.getSync('PREFERRED_LANGUAGE', 'en') || 'en',
  fallbackLng: config.fallbackLng,
  whitelist: config.languages,
  react: {
    wait: false
  }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(i18nextBackend)
    .init(i18nextOptions);
}

export default i18n;
