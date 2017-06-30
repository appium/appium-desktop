import BasePage from './base-page-object';

export default class MainPage extends BasePage {

  constructor (client) {
    super(client);
  }

  get startServerButton () {
    return '#startServerBtn';
  }

  get startNewSessionButton () {
    return '#startNewSessionBtn';
  }

  get serverMonitorContainer () {
    return '#serverMonitorContainer';
  }

  async startServer () {
    await this.client.click(this.startServerButton);
  }

  async startNewSession () {
    await this.client.click(this.startNewSessionButton);
  }
}