module.exports = function(app){

	if(!app.njax){
		app.njax = {};
	}

	require('./callback')(app);

    require('./iframe')(app);

	require('./subscription')(app);

	require('./events')(app);


}