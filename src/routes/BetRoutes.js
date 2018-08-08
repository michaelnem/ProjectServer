'use strict';

const Bet = require('../controllers/betController');


module.exports = function(app) {
    app.route('/addBet').post(Bet.addBet);
    app.route('/getBetsList/:uid').get(Bet.getUserBetsList);
    app.route('/getBetDetails/:bid').get(Bet.getBetDetails);
    app.route('/removeBet').post(Bet.removeBet);
    app.route('/updateBet').post(Bet.updateBet);
}   