module.exports = function(app){
    require('./callback')(app);

    require('./iframe')(app);

	require('./subscription')(app);

	require('./events')(app);
}