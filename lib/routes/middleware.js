
module.exports = function(app){


    app.use(function(req, res, next){
        var api_url = req.api_url.replace('http://', '').replace('https://', '');;
        var www_url = req.www_url.replace('http://', '').replace('https://', '');;

        var allow_origin = null;
        var raw_origin = req.get('Origin');
		if(raw_origin){
			var origin = raw_origin.replace('http://', '').replace('https://', '');
			req.njax.origin = origin;
			if(raw_origin.indexOf('://') != -1){
				req.njax.origin_protocal = raw_origin.split('://')[0];
			}else{
				req.njax.origin_protocal = null;
			}
		}
		/*console.log("!!!!!!!!!!!!!!!!MAAATTTTT REMOVE THIs");
		allow_origin = origin;*/
        if(!origin){
            allow_origin = api_url;
        }else if(origin == api_url){
            allow_origin = api_url;
        }else if(origin == www_url){
            allow_origin = www_url;
        }else if(origin == app.njax.config.core.api.host){
            allow_origin = app.njax.config.core.api.host;
        }else if(origin == app.njax.config.core.host){
            allow_origin = app.njax.config.core.host;
        }else if(origin == app.njax.config.api.host){
            allow_origin = app.njax.config.api.host;
        }if(origin == app.njax.config.core.host){
            allow_origin = app.njax.config.core.host;
        }/*else if (origin == app.njax.config.core.api.host.substr('api.'.length)){
            //TODO: Allow core app to get in this bad boy
            allow_origin =  app.njax.config.core.api.host.substr('api.'.length);
        }*/
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,access_token,client_id,client_secret');
		res.setHeader('Access-Control-Allow-Credentials', true);
		res.bootstrap('allow_origin', allow_origin);
		function finish(err){
			if(err){
				return next(err);
			}
			if(origin){
				/*console.log('Protocol:', req.njax.origin_protocal + '://' + origin);*/
				res.setHeader('Access-Control-Allow-Origin', req.njax.origin_protocal + '://' + origin);

			}


			if(req.method == 'OPTIONS'){
				return res.send("Your Origin is allowed by our 'Access-Control-Allow-Credentials'");
			}
			return next();
		}
		if(!allow_origin){
			return app.njax.routes.origin_middleware(req, res, finish);
		}
		return finish();

    });
	app.use(function(req, res, next){
		//Look for the cookie
		if(!app.sdk || !app.sdk.Account){
			return next();
		}
		var access_token = req.headers.access_token || req.cookies['access_token'];
		if(!access_token){
			if(req.session.access_token){
				req.session.access_token = null;
			}
			return next();
		}
		if(req.session.user && req.session.access_token == access_token){
			//No change of user => No need to load... hopefully
			res.bootstrap('access_token', access_token);
			res.bootstrap('user', new app.sdk.Account(req.session.user));

			return next();
		}
		app.sdk.Account.findByAccessToken(
			access_token,
			{ client_id: app.njax.config.core.app, client_secret:null },
			function(err, account){
				if(err) return next(err);

				req.session.access_token = access_token;
				res.bootstrap('access_token', access_token);
				req.session.user = account.toObject();
				res.bootstrap('user',  account);
				return next();
			}
		);

	});
}