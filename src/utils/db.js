const mongoose = require('mongoose');
const config = require('../config/index')


let db_ok = false;

module.exports = {
    initConnection: (callback) => {
        if(!db_ok){
            mongoose.connect(config.db.uri);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function() {
                db_ok = true;
                console.log("*** Connected to mongoDB of AppScore ***");
                callback();
            });
        }/*else{callback();}*/
    }
};