import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from './app.config';
import settings from '../shared/settings';
import i18nextBackend from 'i18next-node-fs-backend';
import { getI18NextOptions } from '../../../shared/configs/app.config.default';

const i18nextOptions = getI18NextOptions(settings, config);

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(i18nextBackend)
    .init(i18nextOptions);
}

export default i18n;
