const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log('Outgoing request intercepted:', req.method, req.url);
});

const server = http.createServer(function(req, res) {
  proxy.web(req, res, { target: req.url, changeOrigin: true });
});

server.on('connect', function(req, socket) {
  console.log('Outgoing request intercepted:', req.method, req.url);
  const serverUrl = `http://${req.url}`;
  const serverReq = http.request(serverUrl);
  serverReq.on('connect', function(serverRes, serverSocket) {
    socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.pipe(socket);
    socket.pipe(serverSocket);
  });
  serverReq.end();
});

server.listen(8080, function() {
  console.log('Proxy server started on port 8080');
});
