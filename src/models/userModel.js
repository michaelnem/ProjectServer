'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id:        Object,
    Email:      String,
    UserName:   String,
    Password:   String,
    Role:       String,
    Token:      String
}, { collection: 'Users', autoIndex: false , versionKey: false });

mongoose.model('User', userSchema);