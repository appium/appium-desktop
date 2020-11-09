export default class BasePage {

  constructor (client) {
    this.client = client;
    this.originalUrl = client.url();
  }

  async open (path) {
    const url = await this.client.url();
    this.originalUrl = url.value;
    await this.client.url(`${this.originalUrl}${path}`);
  }

  async goHome () {
    if (this.originalUrl) {
      await this.client.url(this.originalUrl);
    }
  }

}
