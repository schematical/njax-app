var async = require('async');
var _ = require('underscore');
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
                app.njax.cache.refresh(req.body.event, req.body, function(){
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