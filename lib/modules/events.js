
module.exports = function(app){
	app.njax.events = {
		query:function (query, callback) {
			//return callback(new Error("This has not been written yet"));
			var qs = '?';
			qs += 'api_url=' + query.api_url;
			qs += '&url=' + query.url;
			qs += '&_njax_type=' + query._njax_type;
			return app.sdk.call('get', '/events' + qs, function(err, events){
				if(err) return callback(err);
				return callback(null, events);
			})
		},
		add:function(account, entity, subscription_data, callback){
			/*var subscription = {};
			subscription.entity_type = entity._njax_type;
			subscription.entity_url = entity.api_url;
			subscription.entity_id = entity._id;
			subscription._entity_name = entity.name;
			subscription._entity_namespace = entity.namespace;
			subscription.account = account._id;*/
			if(entity.toObject){
				entity = entity.toObject();
			}
			var data = {
				entity:entity,
				account:account
			}
			return app.sdk.call('post', '/events', data, function(err, event){
				if(err) return callback(err);
				return callback(null, event);
			})
		}
	}
}