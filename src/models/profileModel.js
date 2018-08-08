'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema

const profileSchema = new Schema({
    _id: Object,
    FirstName: String,
    LastName: String,
    BirthDate: Date,
    AllowToFollow: Boolean,
    Img: String,
    Rating: Number,
    Raters: Array
}, { collection: 'Profiles', autoIndex: false , versionKey: false });

mongoose.model('Profile', profileSchema);