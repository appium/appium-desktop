/* eslint-disable no-console */
import http from 'http';

export function logServer (port, win) {
  let server = http.createServer((req) => {
    let body = [];
    req.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body);
      body = body.toString();
      let logObj;
      try {
        logObj = JSON.parse(body).params;
      } catch (e) {
        console.error(e);
        return;
      }
      let msg = `${logObj.level}: ${decodeURI(logObj.message)}`;
      win.webContents.send('appium-log-line', msg);
    });
  });
  server.listen(port);
  return server;
}
