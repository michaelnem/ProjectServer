'use strict';

const game = require('../controllers/gameController');


module.exports = function(app) {
    app.route('/games/:programId').get(game.getAllGamesByProgramId);
    app.route('/getGame').get(game.getGameById);
    app.route('/getActiveGames').get(game.getActiveGames);
    app.route('/addGames').post(game.addGames);
    app.route('/updateGame').post(game.updateGame);
    app.route('/upsertGames').post(game.upsertGames);
    app.route('/deleteG').post(game.deleteGames);
}   