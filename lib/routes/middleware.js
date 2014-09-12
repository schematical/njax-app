
module.exports = function(app){

    app.use(function(req, res, next){
        //Look for the cookie
        console.log("ACCESS-TOKEN:" + req.cookies['access_token']);
        console.log(app.sdk);
        app.sdk.Account.findByAccessToken(req.cookies['access_token'], function(err, account){
            if(err) return next(err);
            console.log("Found Account!!!!" , account);
            return next();
        });

    });
}