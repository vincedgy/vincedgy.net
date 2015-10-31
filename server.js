#!/bin/env node
/*-----------------------------------------------------------------------
server (express v4)

http/https server with session

 -----------------------------------------------------------------------
 */

var express = require('express'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session),
    bodyParser = require('body-parser'),
    http = require('http'),
    https = require('https'),
    cookieParser = require('cookie-parser'),
    fs = require('fs'),
    router = express.Router(),
    path = require('path'),
    errorhandler = require('errorhandler'),
    //favicon = require('serve-favicon'),
    logger = require('morgan'),
    ejs = require('ejs');


var CONFIG = require(path.join(__dirname,'server/config'));


/**
 * ServerApp : defines the whole server
 * @constructor
 */
var ServerApp = function () {

    var self = this;

    /**
     * Get configuration from env and CONFIG
     */
    self.setupVariables = function () {
        //  Set the environment variables we need.
        self.ipaddress = process.env.HOSTNAME || "127.0.0.1";
        self.http_port = CONFIG.HTTP_PORT || 8080;
        self.https_port = CONFIG.HTTPS_PORT || 443;
    };

    /**
     *  Populate the cache.
     */
    self.populateCache = function () {
        if (typeof self.zcache === "undefined") {
            self.zcache = {
                'index.html': ''
            };
        }
        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync(path.join(CONFIG.VIEW_DIR,'index.html'));
    };

    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function (key) {
        return self.zcache[key];
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function (sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function () {
        //  Process on exit and signals.
        process.on('exit', function () {
            self.terminator();
        });
        // Every signals
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM']
            .forEach(function (element, index, array) {
                process.on(element, function () {
                    self.terminator(element);
                });
            });
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function () {

        // Initialize express
        self.app = express();

        // Logger
        if (self.app.get('env') !== 'production') {
            var accessLogStream = fs.createWriteStream(path.join(CONFIG.LOGS_DIR,'/access.log') , {flags: 'a'});
            self.app.use(logger('combined', {stream: accessLogStream}));
        }

        // Add static content
        var options = {
            dotfiles: 'ignore',
            etag: false,
            extensions: ['htm', 'html'],
            index: false,
            maxAge: '1d',
            redirect: false,
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now());
            }
        };
        self.app.use(express.static(CONFIG.VIEW_DIR, options));
        self.app.set('views', express.static(CONFIG.VIEW_DIR));
        self.app.engine('ejs', ejs.renderFile);
        self.app.set('view engine', 'ejs');

        // Application capabilities
        self.app.use(bodyParser.json()); // for parsing application/json
        self.app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

        // Cookie parser
        self.app.use(cookieParser());

        // Session handler
        var sess = {
            store: new FileStore,
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: true,
            cookie: { }
        };
        if (self.app.get('env') === 'production') {
            self.app.set('trust proxy', 1); // trust first proxy
            sess.cookie.secure = true; // serve secure cookies
        }
        self.app.use(session(sess));

        // Cookie Parser
        self.app.use(cookieParser());

        // Mount the router on app
        self.app.use('/', require(path.join(CONFIG.BASE_DIR,'routes.js'))(router));

        self.app.use(function(req, res, next){
          res.status(404);
          // respond with html page
          if (req.accepts('html')) {
            res.render('404', { url: req.url });
            return;
          }
          // respond with json
          if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
          }
          // default to plain-text. send()
          res.type('txt').send('Not found');
        });

        // ErrorHandler for non production env
        if (self.app.get('env') !== 'production') {
            self.app.use(errorhandler());
        }
    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function () {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();
        self.initializeServer();
    };



    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {

        // Create HTTPS
        self.httpSecureServer = https.createServer({
            key: fs.readFileSync(path.join(CONFIG.SSL_DIR) + '/server.key'),
            cert: fs.readFileSync(path.join(CONFIG.SSL_DIR) + '/server.crt'),
            ca: fs.readFileSync(path.join(CONFIG.SSL_DIR) + '/ca.crt'),
            requestCert: true,
            rejectUnauthorized: false
        }, self.app).listen(self.https_port, self.ipaddress, function() {
            console.log('%s: Node SECURE server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.https_port);
        });

        // Create HTTP
        self.httpServer = http.createServer(self.app)
            .listen(self.http_port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.http_port);
        });

    };

};

/**
 *  main():  Main code.
 */
var serverApp = new ServerApp();
serverApp.initialize();
serverApp.start();

/* */
process.on('uncaughtException', function (error) {
   console.log(error.stack);
});
