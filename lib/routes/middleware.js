
module.exports = function(app){

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
    app.use(function(req, res, next){
        var api_url = req.api_url;
        var www_url = req.www_url;

        var allow_origin = null;
        var raw_origin = req.get('Origin');
        var origin = raw_origin && raw_origin.replace('http://', '').replace('https://', '');
        if(!origin){
            allow_origin = api_url;
        }else if(origin == api_url){
            allow_origin = api_url;
        }else if(origin == www_url){
            allow_origin = www_url;
        }else if(origin == app.njax.config.core.api.host){
            allow_origin = app.njax.config.core.api.host;
        }else if (origin == app.njax.config.core.api.host.substr('api.'.length)){
            //TODO: Allow core app to get in this bad boy
            allow_origin =  app.njax.config.core.api.host.substr('api.'.length);
        }

        if(!allow_origin){
            return res.send("Your Origin is NOT allowed by our 'Access-Control-Allow-Credentials'");
        }
        res.setHeader('Access-Control-Allow-Origin', req.protocol + '://' + allow_origin);

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,access_token,client_id,client_secret');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.bootstrap('allow_origin', allow_origin);

        if(req.method == 'OPTIONS'){
            return res.send("Your Origin is allowed by our 'Access-Control-Allow-Credentials'");
        }
        return next();
    });
}