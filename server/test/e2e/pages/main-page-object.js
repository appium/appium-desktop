import BasePage from '../../../../shared/base-page-object';

export default class MainPage extends BasePage {
  constructor (client) {
    super(client);
    Object.assign(this, MainPage.selectors);
  }

  async startServer () {
    await this.client.click(this.startServerButton);
  }

  async startNewSession () {
    await this.client.click(this.startNewSessionButton);
  }
}

MainPage.selectors = {
  startServerButton: '#startServerBtn',
  startNewSessionButton: '#startNewSessionBtn',
  serverMonitorContainer: '#serverMonitorContainer',
};
