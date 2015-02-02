var async = require('async');
var _ = require('underscore');
var path = require('path');


var config = {
    cookie:{
        secret:'ninja_face'
    },
    callback:{
        uri:'/callbacks'
    },
    iframe:{
        uri:'/iframe'
    },
    app_dir:path.join(__dirname, '..', '..'),
    port:3000,
    api:{
        protocol:'https',
        host:'api.localhost:3000'
    },
    core:{
        host:'localhost:3030',
        api:{
            protocol:'https'
        }
    }
};
var njax_util = require('njax-util');
var njax_app = function(options){

    options = _.extend(config, options)
    if(!options.core.api.host){
        options.core.api.host = 'api.' + options.core.host;
    }
    var app = njax_util.app(options);
	if(!app.njax.config.crypto_key){
		app.njax.config.crypto_key = app.njax.config.client_secret;
	}
    app.njax.config.njax_dir = path.join(__dirname, '..');

    app.njax.config.njax_tpl_dir = path.join(app.njax.config.njax_dir, 'public', 'templates');
    app.locals.partials = {};
    app.locals.partials._header = app.njax.config.njax_util_tpl_dir + '/_header';
    app.locals.partials._footer = app.njax.config.njax_util_tpl_dir + '/_footer';
    app.njax.config.tpl_dir = path.join(app.njax.config.app_dir, 'public', 'templates');
	app.njax.addTemplateDir('');
	app.njax.addAssetDir(path.join(app.njax.config.njax_dir, 'public'));
	app.njax.addTemplateDir(app.njax.config.njax_tpl_dir);

    require('./modules')(app);

    require('./routes')(app);
	var _start = _.bind(app.start, app);
	app.start = _.bind(function(cb){
		app.njax.addTemplateDir(app.njax.config.tpl_dir);
		_start(cb);
	}, app);
	return app;

}

module.exports = njax_app;