
var FCM = require('fcm-node');
const config = require('../config/index');
var serverKey = config.firebase.ServerKey; //put your server key here
var fcm = new FCM(serverKey);


exports.pushNotification = (token, title, body) => {
    let message = { 
        to: token,
        notification: {
            title:  title, 
            body:   body
        }
    };

    fcm.send(message, (err, response) => {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}