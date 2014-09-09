var async = require('async');
var _ = require('underscore');
var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var serveStatic = require('serve-static');
var bodyParser     = require('body-parser');
var multipart = require('connect-multiparty');
var errorhandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');


var config = {
    cookie:{
        secret:'ninja_face'
    },
    callback:{
        uri:'/callbacks'
    },
    settings:{
        uri:'/settings'
    },
    app_dir:path.join(__dirname, '..', '..'),
    port:3000
};
var njax_app = function(options){
    njax_app.config = config = _.extend(config, options);
    var app = express();
    app.njax = njax_app;
    app.njax.routes = {};//Specal extendable routes

    // all environments
    app.set('port', config.port || 3000);
    app.set('views', path.join(config.app_dir, 'public/templates'));
    app.set('view engine', 'hjs');

    app.use(cookieParser())
    app.use(session({ secret: config.cookie.secret, cookie: {  }}));
    app.use(multipart());
    config.njax_dir = path.join(__dirname, '..');
    config.njax_tpl_dir = path.join(config.njax_dir, 'public', 'templates');

    config.tpl_dir = path.join(config.app_dir, 'public', 'templates');

    app.use(bodyParser());

    if(app.get('env') == 'development'){
        //APP Specific assets
        app.use(serveStatic(path.join(config.app_dir, 'public')));
        app.locals.asset_url = './';
        app.use(morgan('dev'));


        //NJax Specific
        app.all('/njax/*', function(req, res, next){
            var asset_path = req.path.substr(5);
            var real_asset_path = path.join(config.njax_dir, 'public',asset_path);

            if(fs.existsSync(real_asset_path)){
                return res.sendfile(real_asset_path);
            }
            return next();
        });
        app.locals.njax_asset_url = '/njax';
    }
    app.use(errorhandler());


    app.start = _.bind(njax_app._start(app), njax_app);

    //Start up modules
    require('./modules')(app);
    //Start up routes
    require('./routes')(app);
    return app;
}
njax_app._start = function(app){
    return function(options, callback){
        if(!callback && _.isFunction(options)){
            callback = options;
        }
        for(var i in app.locals.partials){
            app.locals.partials[i] = njax.setup_partials(app.locals.partials[i]);
        }

        app.use(function(req, res, next){
            console.log("404 Hit");
            res.send(404, 'Sorry cant find that!');
        });
        var server = http.createServer(app);
        server.listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
            if(callback){
                return callback(null, app, server);
            }
        });
    }
}

module.exports = njax_app;