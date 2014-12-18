
module.exports = function(app){
	app.param('tag', function(req, res, next, id){
		if(!app.sdk.Tag){
			return next(new Error("No Tag found inthe SDK"))
		}
		return app.sdk.Tag.findOne({ _id: id }, function(err, tag){
			if(err) return next(err);
			if(tag){
				res.bootstrap('tag', tag);
			}
			return next();
		});
	});
}