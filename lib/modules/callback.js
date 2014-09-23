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
            var events = [];
            /*
           if(!njax_callbacks.events[event]){
                return onComplete();
            }
            var events = njax_callbacks.events[event];
            */
            for(var i in njax_callbacks.events){

                if(i == event || new RegExp(i).test(event)){
                    events = events.concat(_.clone(njax_callbacks.events[i]));
                }
            }

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