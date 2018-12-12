import _ from 'lodash';
import settings from 'electron-settings';
import config from './config';

class CloudProvider {

  constructor (providerName, providerData) {
    const {label} = providerData;
    this.name = providerName;
    this.label = label;
  }

  getSettingsKey (keyName) {
    return `Providers.${this.name}.${keyName}`;
  }

  async isVisible () {
    const visibilityKey = this.getSettingsKey('visible');
    const isVisible = settings.get(visibilityKey);
    if (!_.isBoolean(isVisible)) {
      await this.setVisible(true);
      return true;
    }
    return isVisible;
  }

  setVisible (isVisible = true) {
    const visibilityKey = this.getSettingsKey('visible');
    settings.set(visibilityKey, isVisible);
  }

}


const providers = {};
for (let [providerName, providerData] of _.toPairs(config)) {
  providers[providerName] = new CloudProvider(providerName, providerData);
}

export default providers;