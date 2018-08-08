'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const betSchema = new Schema({
    _id:            Object, //Uniqe form ID
    Uid:            String, //The user that own the form
    BetAmount:      Number,
    WinningAmount:  { type: Number, default: -10 },
    BetGames:  [{
        _id:        false,
        fgId:       Object,
        ProgramId:  Number,
        GameId:     Number,
        Result:     String,
        betState:   String,
        Bet:    {
            Choice: String,
            Rate:   Number
        }
    }],
    SubmissionDate: Date,
    State:          String,
 }, { collection: 'Bets', autoIndex: false , versionKey: false });


mongoose.model('Bet', betSchema);