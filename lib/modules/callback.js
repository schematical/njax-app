var async = require('async');
var _ = require('underscore');
module.exports = function(app){
    app.njax.callbacks = njax_callbacks = {
        events:{},
        listen:function(event, callback){
            if(!njax_callbacks.events[event]){
                njax_callbacks.events[event] = [];
            }
            njax_callbacks.events[event].push(callback);
        },
        trigger:function(event, data, onComplete){
            //TODO:change this to regex
            if(!njax_callbacks.events[event]){
                return onComplete();
            }
            var events = njax_callbacks.events[event];
            async.eachSeries(
                events,
                function(event, cb){
                    return event(event, data, cb);
                },
                function(errs){
                    return onComplete();
                }
            )

        }
    }
}