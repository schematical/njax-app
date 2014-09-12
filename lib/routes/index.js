module.exports = function(app){
    require('./middleware')(app);

    require('./callbacks')(app);

    require('./settings')(app);
}