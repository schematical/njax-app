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
		var sdk = null;
		var access_token = data.access_token || (data.user  && data.user.access_token);
		if(access_token){
			//If access token then create sdk
			sdk = require('100-sdk')({
				access_token:access_token,
				client_id:app.njax.client_id
			});
		}
		for(var i in data){
			if(!_.contains(exempt, i)){
				var data_record = data[i];
				if(sdk && data_record._njax_type && app.sdk[data_record._njax_type]){
					try{

						data_record = new sdk[data_record._njax_type](data_record);


					}catch(e){
						//Nothing really to do
					}
				}
				res.bootstrap(i, data_record);
				//Stash it in the session...I guess
				req.session[i] = data[i];
			}
		}
		return next();
	});
}