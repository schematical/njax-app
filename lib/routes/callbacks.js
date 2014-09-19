module.exports = function(app){
    var callback_uri = app.njax.config.callback.uri;

    app.all(callback_uri, function(req, res, next){
        async.series([
            function(cb){
                app.njax.callbacks.trigger(req.body.event, req.body, function(){
                    return cb();
                });
            },
            function(cb){
                app.cache.refresh(req.body.event, req.body, function(){
                    return cb();
                });
            }
        ],
        function(){
            //end async
            res.send("Finished");
        });


    });
}