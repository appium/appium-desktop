import BasePage from './base-page-object';

export default class MainPage extends BasePage {

  static selectors = {
    startServerButton: '#startServerBtn',
    startNewSessionButton: '#startNewSessionBtn',
    serverMonitorContainer: '#serverMonitorContainer',
  }

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