const { createProxyMiddleware } = require('http-proxy-middleware');
// const url = `http://devppool.arsyun.com/`;
const url = `http://192.168.1.212/`;

module.exports = function(app) {
    app.use(
        createProxyMiddleware("/user/", {
            target: url,
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware("/pool/", {
            target: url,
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware("/warning/", {
            target: url,
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware("/workorder/", {
            target: url,
            changeOrigin: true,
        })
    );
};