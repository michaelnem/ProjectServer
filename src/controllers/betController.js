'use strict';

const mongoose = require('mongoose');
const Bet = mongoose.model('Bet');
const Game = mongoose.model('Game');

exports.addBet = (req, res) => {
    if(!req.body.newBet){
        res.status(400).send({'err' : 'data missing'});
        return;
    }
    try{
        Bet.insertMany(req.body.newBet);
    }catch(e){
        res.send({'err': 'faild to insert data'});
    }finally{
        res.send({'msg': 'ok'});
    }
    //res.send({ 'msg': 'ok'});
}

exports.getUserBetsList = (req, res) => {
    if(!req.params.uid){
        res.status(400).send({'err' : 'uid is missing'});
        return;
    }
    // check token
    
    Bet.aggregate([{ $match: { Uid: req.params.uid }}, {
        $addFields: {
            GamesAmount: { $size: "$BetGames" }
        }
    }, {
        $project: {
            WinningAmount:  1,
            SubmissionDate: 1,
            State:          1,
            GamesAmount:    1
        }
    }], (err, data) => {
        if(err){
            res.status(400).send({ 'err': "CAn't fetch data from db." });
            return;
        }
        res.send({ 'BetsList': data });
    });
}

exports.getBetDetails = (req, res) => {
    if(!req.params.bid){
        res.status(400).send({'err' : 'bid is missing'});
        return;
    }
    //check token
    let ObjectId = require('mongoose').Types.ObjectId; 
    Bet.findOne({ _id: ObjectId(req.params.bid) }, (err, betForm) => {
        if(err){
            res.status(400).send({ 'err': "CAn't fetch data from db." });
            return;
        }
        else{
            let myGames = betForm.BetGames.map(doc => { return ObjectId(doc.fgId); });
            Game.find( {_id: { $in : myGames }}, (err, games)=> {
                if(err){
                    res.status(400).send({ 'err': 'Can\'t find bet games in db!' });
                }
                else{
                    games.forEach(game => {
                        if(!game.IsActive){
                            let idx = betForm.BetGames.findIndex(gameBet => { return  (gameBet.fgId === game._id.toString()); });
                            if(betForm.BetGames[idx].Bet.Choice === game.Result){ betForm.BetGames[idx].betState = 'Winner'; }
                            else{ betForm.BetGames[idx].betState = 'Lost'; }
                            betForm.BetGames[idx].Result = game.Result;
                        }
                    });
                    Bet.update({ _id: ObjectId(req.body.bid) },
                    betForm,
                    { upsert: false, multi: false }, 
                    (err, updated) => {
                        if(err) res.status(400).send({ 'BetDetails': betForm, 'err': 'Can\'t Update games' });
                        else res.send({ 'BetDetails': betForm });
                    });
                }
            });
        }
        
    });
}

exports.removeBet = (req, res) => {
    if(!req.body.UId || !req.body.BId){
        res.status(404).send({'err':'Data is missing'});
        return;
    }
    //console.log(req.body);
    //Check token
    let ObjectId = require('mongoose').Types.ObjectId; 
    Bet.remove({ _id: ObjectId(req.body.BId), Uid: req.body.UId }, (err, doc) => {
        if(err){
            res.status(400).send({ 'err': "Can't find data to remove." });
        }
        //console.log(doc);
        if (doc.n > 0){
            res.send({ 'msg' : 'Remove Successful' });
        }
        else{
            res.status(404).send({ 'err': 'No data to remove.!' });
        }
    });
}

exports.updateBet = (req, res) => {
    if(!req.body.bid || !req.body.GamesAmount){
        res.status(404).send({'err':'Data is missing'});
        return;
    }
    //Check token
    let ObjectId = require('mongoose').Types.ObjectId; 

    Bet.findOne({ _id: ObjectId(req.body.bid)}, (err, betForm) => {
        if(err){
            res.status(400).send({ 'err': 'Can\'t find bet in db!' });
        }
        else{
            let myGames = betForm.BetGames.map(doc => { return ObjectId(doc.fgId);  });
            Game.find( {_id: { $in : myGames }}, (err, games) =>{
                if(err){
                    res.status(400).send({ 'err': 'Can\'t find bet games in db!' });
                }
                else {
                    let Live = {}, Lost = {};
                    try{
                        games.forEach(game => {
                            if(game.IsActive) throw Live;
                            else{
                                let idx = betForm.BetGames.findIndex(gameBet => {
                                    return  (gameBet.fgId === game._id.toString()) 
                                            &&
                                            (gameBet.Bet.Choice === game.Result);
                                });
                                if(idx < 0) throw Lost;
                            }
                        });
                        Bet.update(
                        { _id: ObjectId(req.body.bid) },
                        { 'State': 'Winner'},
                        { upsert: false, multi: false}, 
                        (err, updated) => {
                            if(err) res.status(400).send({ 'err': 'Can\'t Update winner' });
                            else res.send({ 'State': 'Winner' });
                        });
                    }catch(e){
                        if (e === Live) res.send({ 'State': 'Live' });
                        else if (e === Lost) {
                            Bet.update(
                            { _id: ObjectId(req.body.bid) },
                            { 'State': 'Lost'},
                            { upsert: false, multi: false}, 
                            (err, updated) => {
                                if(err) res.status(400).send({ 'err': 'Can\'t Update winner' });
                                else res.send({ 'State': 'Lost' });
                            });
                        }
                    }
                }
            });
        }
    });
}