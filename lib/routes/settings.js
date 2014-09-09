module.exports = function(app){
    var settings_uri = app.njax.config.settings.uri;

    app.all(settings_uri + '*', function(req, res, next){
        //TODO: Parse data being posted in and store-in session
        return next();
    });
}