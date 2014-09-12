
module.exports = function(app){

    app.use(function(req, res, next){
        //Look for the cookie
        console.log("ACCESS-TOKEN:" + req.cookies['access_token']);
        if(!req.cookies['access_token']){
            if(req.session.access_token){
                req.session.access_token = null;
            }
            return next();
        }
        console.log("Cached User:", req.session.user);
        if(req.session.access_token == req.cookies['access_token']){
            //No change of user => No need to load... hopefully
            res.bootstrap('user', new app.sdk.Account(req.session.user));

            return next();
        }
        app.sdk.Account.findByAccessToken(
            req.cookies['access_token'],
            { client_id: null, client_secret:null },//app.njax.config.core_app },
            function(err, account){
                if(err) return next(err);
                req.session.access_token = req.cookies['access_token'];

                req.session.user = account.toObject();
                res.bootstrap('user',  account);
                return next();
            }
        );

    });
}