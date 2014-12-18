module.exports = function(app){
    require('./middleware')(app);
	require('./origin_middleware')(app);
    require('./callbacks')(app);
	require('./tags')(app);
    require('./iframe')(app);
}