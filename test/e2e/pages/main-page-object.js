import BasePage from '../../../gui-common/base-page-object';

export default class MainPage extends BasePage {
  constructor (client) {
    super(client);
    Object.assign(this, MainPage.selectors);
  }

  async startServer () {
    (await this.client.$(this.startServerButton)).click();
  }

  async startNewSession () {
    (await this.client.this.startNewSessionButton).click();
  }
}

MainPage.selectors = {
  startServerButton: '#startServerBtn',
  startNewSessionButton: '#startNewSessionBtn',
  serverMonitorContainer: '#serverMonitorContainer',
};
