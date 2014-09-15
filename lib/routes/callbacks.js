module.exports = function(app){
    var callback_uri = app.njax.config.callback.uri;

    app.all(callback_uri, function(req, res, next){
        console.log("Event Triggererd:", req.body.event);
        app.njax.callbacks.trigger(req.body.event, req.body, function(){
            res.send("Finished");
        });
    });
}