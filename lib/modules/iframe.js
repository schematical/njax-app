module.exports = function(app){
    app.njax.iframe = {
        middleware:function(req, res, next){
            //TODO: Pull the data out of the req.data and wrap it in the api client
            return next();
        }
    }
}