const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware("/user/", {
            target: "http://devppool.arsyun.com/",
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware("/pool/", {
            target: "http://devppool.arsyun.com/",
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware("/warning/", {
            target: "http://devppool.arsyun.com/",
            changeOrigin: true,
        })
    );
    app.use(
        createProxyMiddleware("/workorder/", {
            target: "http://devppool.arsyun.com/",
            changeOrigin: true,
        })
    );
};