var httpProxy = require('http-proxy');
var fs = require('fs');
var path = require('path');

//
// Create the proxy server listening on port 443
//
var keyPath = path.resolve(__dirname, 'key.pem');
var certPath = path.resolve(__dirname, 'cert.pem');
console.log('@@@@@', keyPath);
console.log('@@@@@', certPath);
httpProxy.createServer({
  ssl: {
    key: fs.readFileSync(keyPath, 'utf8'),
    cert: fs.readFileSync(certPath, 'utf8'),
    passphrase: 'Are your beers okay?'
  },
  target: 'http://localhost:4723'
}).listen(9999);