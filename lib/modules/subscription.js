
module.exports = function(app){
	app.njax.subscription = {
		query:function (query, callback) {
			return callback(new Error("This has not been written yet"));
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
			return app.sdk.call('post', '/subscriptions', data, function(err, subscription){
				if(err) return callback(err);
				return callback(null, subscription);
			})
		}
	}
}