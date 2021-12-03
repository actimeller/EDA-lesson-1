const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      onProxyRes: (proxyRes, req) => {
        // eslint-disable-next-line no-console
        console.log(
          `[${req.method}] [${proxyRes.statusCode}] ${req.path} -> ${proxyRes.req.path}`,
        );
      },
    }),
  );
};
