'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const gameSchema = new Schema({
    _id:        Object,
    ProgramId:  Number,
    GameId:     Number,
    Time:       String,
    Date:       String,
    GuestTeam:  String,
    HomeTeam:   String,
    XTeam:      String,
    IsSingle:   Boolean,
    IsDouble:   Boolean,
    HomeRate:   Number,
    GuestRate:  Number,
    XRate:      Number,
    Result:     String,
    EventId:    Number,
    GameType:   String,
    IsActive:   Boolean,
    Type_name:  String
}, { collection: 'ProgramGames', autoIndex: false, versionKey: false });


mongoose.model('Game', gameSchema);
