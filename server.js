/*
***************
    Imports
***************
*/

//Express
const express = require('express');

//MongoDB & Mongooses
const mongoose = require('mongoose');
const db = require('./src/utils/db');

//Schemes + Models
const Program       = require('./src/models/programModel');
const Game          = require('./src/models/gameModel');
const User          = require('./src/models/userModel');
const Profile       = require('./src/models/profileModel');
const Bet           = require('./src/models/betModel');
const Follow        = require('./src/models/followModel');

//Middleware
const bodyParser = require('body-parser');
const config = require('./src/config/index');

//Cors
const cors = require('cors');

//Routes
const programRoutes     = require('./src/routes/programRoutes');
const gameRoutes        = require('./src/routes/gameRoutes');
const userRoutes        = require('./src/routes/userRoutes');
const BetRoutes         = require('./src/routes/BetRoutes');


/*
*********************************
    Initialization middleware
*********************************
*/

//Express
const app = express();

//MongoDB & Mongoose
db.initConnection(function(){  
    console.log("ready");
    //User.update({ username: "Michael"}, { $set: { username: "Michaell"}}, );
});

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
// app.use(function(req, res, next){
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     //res.setHeader('Access-Control-Allow-Credentials', false);
//     next();
// });
app.use(cors());

//Routes
userRoutes(app);
gameRoutes(app);
programRoutes(app);
BetRoutes(app);

//Check all the unknow requests\routes
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});


//fcm check
// const fcmCtrl = require('./src/utils/fcm');
//fcmCtrl.pushNotification( null, 'John', 'You are gay');

/*
***************************
    Server start point
***************************
*/

app.listen(3000, () => {
    console.log('AppScore API listen on port: ' + config.port);
});