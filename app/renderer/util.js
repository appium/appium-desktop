import { withTranslation as wt } from 'react-i18next';
import _ from 'lodash';
import config from '../configs/app.config';

export function withTranslation (componentCls, ...hocs) {
  return _.flow(
    ...hocs,
    wt(config.namespace),
  )(componentCls);
}
