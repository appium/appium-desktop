import _ from 'lodash';
import { retryInterval } from 'asyncbox';
import BasePage from './base-page-object';

export default class InspectorPage extends BasePage {

  constructor (client) {
    super(client);
  }

  get customServerHost () {
    return '#customServerHost';
  }

  get customServerPort () {
    return '#customServerPort';
  }

  get addDesiredCapabilityButton () {
    return '#btnAddDesiredCapability';
  }

  get formSubmitButton () {
    return '#btnStartSession';
  }

  get inspectorToolbar () {
    return 'div[class*=Inspector__inspector-toolbar]';
  }

  get selectedElementBody () {
    return '#selectedElementContainer .ant-card-body';
  }

  get tapSelectedElementButton () {
    return '#selectedElementContainer #btnTapElement';
  }

  get sourceTreeNode () {
    return '#sourceContainer .ant-tree-node-content-wrapper';
  }

  get recordedActionsPane () {
    return 'div[class*=Inspector__recorded-actions]';
  }

  get startRecordingButton () {
    return '#btnStartRecording';
  }

  get pauseRecordingButton () {
    return '#btnPause';
  }

  get reloadButton () {
    return '#btnReload';
  }

  get screenshotLoadingIndicator () {
    return '#screenshotContainer .ant-spin-dot';
  }

  desiredCapabilityNameInput (rowIndex) {
    return `#desiredCapabilityName_${rowIndex}`;
  }

  desiredCapabilityValueInput (rowIndex) {
    return `#desiredCapabilityValue_${rowIndex}`;
  }

  async setCustomServerHost (host) {
    await this.client.setValue(this.customServerHost, host);
  }

  async setCustomServerPort (host) {
    await this.client.setValue(this.customServerPort, host);
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