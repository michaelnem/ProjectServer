'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    ObjectId = mongoose.Types.ObjectId;

const recommendSchema = new Schema({
    Recommender :   ObjectId,
    ProgramId   :   Number,
    GameId      :   Number,
    Prediction  :   String,
    Description :   String,
    Result      :   String
    //IsActive    :   Boolean
}, { collection: 'Recommendations', autoIndex: false , versionKey: false });

mongoose.model('Recommend', recommendSchema);