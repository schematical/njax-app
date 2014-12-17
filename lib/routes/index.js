module.exports = function(app){
    require('./middleware')(app);
	require('./origin_middleware')(app);
    require('./callbacks')(app);

    require('./iframe')(app);
}