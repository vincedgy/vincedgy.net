var path = require('path')
    , baseDir = __dirname;

module.exports = {
    "SERVICE": "Gmail",
    "USER": "vincent.dagoury@gmail.com",
    "PASSWORD": "uagodymudpcwpstq",
    "HTTP_PORT": 8080,
    "HTTPS_PORT": 443,
    "BASE_DIR": baseDir,
    "LOGS_DIR": baseDir + '/logs',
    "API_DIR": baseDir + '/api',
    "SSL_DIR": baseDir + '/sslcert',
    "CTRL_DIR": baseDir + '/ctrl',
    "VIEW_DIR": baseDir + '/../public'
};
