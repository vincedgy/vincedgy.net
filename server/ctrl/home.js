var path = require('path'),
    config = require('../config.js');

module.exports = function (req, res) {
    console.log('Home page !');
    res.sendFile(path.join(config.VIEW_DIR, 'index.html'), function(err, html) {
        res.send(html);
    });
};