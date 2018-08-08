'use strict';

const user = require('../controllers/userController');
const follow = require('../controllers/followingCtrl');

module.exports = function(app) {
    app.use('/register', user.ValidNewUser)
    app.route('/register').post(user.Register);
    app.route('/profileUpdate').post(user.ProfileUpdate);
    app.route('/rateProfileUpdate').post(user.rateProfileUpdate);
    app.route('/login').post(user.Login);
    app.route('/checkToken').post(user.UserTokenValid);
    app.route('/UsersATF/:Uid').get(user.getUsersAllowToFollow);
    app.route('/addFollower').post(follow.saveNewFollowing);
    app.route('/getFollowing/:Uid').get(follow.getAllFollowingByUserId);
    app.route('/getFollowers/:Uid').get(follow.getAllFollowersByUserId);
    app.route('/removeFollowing').post(follow.removeFollowing);
}   