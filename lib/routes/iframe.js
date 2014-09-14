module.exports = function(app){
    var iframe_uri = app.njax.config.iframe;

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
        for(var i in data){
            res.bootstrap(i, data[i]);
            //Stash it in the session...I guess
            req.session[i] = data[i];
        }
        return next();
    });
}