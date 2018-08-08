'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const programSchema = new Schema({
    ProgramId: String,
    IsActive: Boolean,
    StartDate: String

},{ collection: 'Programs', autoIndex: false , versionKey: false});

mongoose.model('Program', programSchema);