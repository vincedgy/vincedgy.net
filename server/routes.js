var path = require('path'),
    config = require('./config.js');

module.exports = function(router) {
    var self = this;

    console.log('Configuring ROUTER...');

    // Add Home route
    router.get('/', require(path.join(config.CTRL_DIR, 'home.js')));

    // Add POST routes for Sending email
    router.use('/email', require(path.join(config.CTRL_DIR, 'post-mail.js')));

    // Return the router to application
    return router;
};
