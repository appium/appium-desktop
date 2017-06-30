import _ from 'lodash';

export default class InspectorPage {

  constructor (client) {
    this.client = client;
    this.originalUrl = client.url();
  }

  async open (path) {
    const url = await this.client.url();
    this.originalUrl = url.value;
    console.log('Navigating to ', `${this.originalUrl}/${path}`);
    await this.client.url(`${this.originalUrl}${path}`);
  }

  async goHome () {
    if (this.originalUrl) {
      await this.client.url(this.originalUrl);
    }
  }

}