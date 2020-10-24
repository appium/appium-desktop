import _ from 'lodash';
import { retryInterval } from 'asyncbox';
import BasePage from '../../../../shared/base-page-object';
import { setValueReact } from './utils';

export default class InspectorPage extends BasePage {
  constructor (client) {
    super(client);
    Object.assign(this, InspectorPage.selectors);
  }

  desiredCapabilityNameInput (rowIndex) {
    return `#desiredCapabilityName_${rowIndex}`;
  }

  desiredCapabilityValueInput (rowIndex) {
    return `#desiredCapabilityValue_${rowIndex}`;
  }

  async setCustomServerHost (host) {
    await this.client.execute(setValueReact(this.customServerHost, host));
  }

  async setCustomServerPort (port) {
    await this.client.execute(setValueReact(this.customServerPort, port));
  }

  async addDCaps (dcaps) {
    const dcapsPairs = _.toPairs(dcaps);
    for (let i = 0; i < dcapsPairs.length; i++) {
      const [name, value] = dcapsPairs[i];
      await this.client.setValue(this.desiredCapabilityNameInput(i), name);
      await this.client.setValue(this.desiredCapabilityValueInput(i), value);
      await this.client.click(this.addDesiredCapabilityButton);
    }
  }

  async startSession () {
    await this.client.click(this.formSubmitButton);
  }

  async closeNotification () {
    try {
      await retryInterval(5, 500, () => {
        this.client.click('.ant-notification-notice-close');
      });
    } catch (ign) { }
  }

  async startRecording () {
    await this.client.click(this.startRecordingButton);
  }

  async pauseRecording () {
    await this.client.click(this.pauseRecordingButton);
  }

  async reload () {
    await this.client.click(this.reloadButton);
  }

}

InspectorPage.selectors = {
  customServerHost: '#customServerHost',
  customServerPort: '#customServerPort',
  addDesiredCapabilityButton: '#btnAddDesiredCapability',
  formSubmitButton: '#btnStartSession',
  inspectorToolbar: 'div[class*=_inspector-toolbar]',
  selectedElementBody: '#selectedElementContainer .ant-card-body',
  tapSelectedElementButton: '#selectedElementContainer #btnTapElement',
  sourceTreeNode: '#sourceContainer .ant-tree-node-content-wrapper',
  recordedActionsPane: 'div[class*=_recorded-actions]',
  startRecordingButton: '#btnStartRecording',
  pauseRecordingButton: '#btnPause',
  reloadButton: '#btnReload',
  screenshotLoadingIndicator: '#screenshotContainer .ant-spin-dot',
};
