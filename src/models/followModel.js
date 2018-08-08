'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
    UId: String,
    FId: String
}, { collection: 'Followers', autoIndex: false , versionKey: false });

mongoose.model('Follow', followSchema);