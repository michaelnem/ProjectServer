'use strict';

const program = require('../controllers/programController');

module.exports = function(app) {
    app.route('/Programs').get(program.getAllPrograms);
    app.route('/Programs/:programId').get(program.getProgramById);
    app.route('/newPrograms').post(program.addNewPrograms);
    app.route('/updatePrograms').post(program.updatePrograms);
}