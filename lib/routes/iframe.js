var _ = require('underscore');
module.exports = function(app){
    var iframe_uri = app.njax.config.iframe.uri;

    app.all(iframe_uri + '*', function(req, res, next){

        //TODO: Parse data being posted in and store-in session
        if(!req.body.njax_payload){
            return next();//next(new Error("No 'njax_payload' posted in"));
        }
        var data = null;
        try{
            data = JSON.parse(req.body.njax_payload);
        }catch(e){
            return next(e);
        }
        var exempt = [
            'api_url',
            'www_url',
            'core_api_url',
            'core_www_url',
            'client_id'
        ]
        for(var i in data){
            if(!_.contains(exempt, i)){
                res.bootstrap(i, data[i]);
                //Stash it in the session...I guess
                req.session[i] = data[i];
            }
        }
        return next();
    });
}