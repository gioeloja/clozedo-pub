const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy requests to the root path ('/') to port 8080
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:8443',
      changeOrigin: true,
      

    })
  );

  // Proxy Socket.IO requests to port 8443
  app.use(
    '/socketio',
    createProxyMiddleware({
      target: 'http://localhost:8880',
      changeOrigin: true,
    })
  );
};
