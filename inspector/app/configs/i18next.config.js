import i18n from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';
import config from './app.config';
import settings from '../shared/settings';
import { getI18NextOptions } from '../../../shared/configs/app.config.default';

const i18nextOptions = getI18NextOptions(settings, config);

if (!i18n.isInitialized) {
  i18n
    .use(i18nextBackend)
    .init(i18nextOptions);
}

export default i18n;
