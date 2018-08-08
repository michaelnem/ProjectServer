'use strict';

const mongoose = require('mongoose');
const Game = mongoose.model('Game');

exports.getGameById = (req, res) => {
    if(!(req.query.programId || req.query.gameId)){
        res.status(400).send({'err' : 'Data is missing'});
        return;
    }
    
    Game.findOne({ProgramId: req.query.programId, GameId:req.query.gameId}, {'_id': 0}, (err, game) => {
         if(err || !game){
            res.send({'err': 'Game not found!'});
            return;
         }
         res.send({'game': game});
    });
}

exports.addGames = (req, res) => {
    if(!req.body.newGames){
        res.status(400).send({'err' : 'data missing'});
        return;
    }
    try{
        Game.insertMany(req.body.newGames);
    }catch(e){
        res.send({'err': 'faild to insert data'});
    }finally{
        res.send({'msg': 'ok'});
    }
}

exports.upsertGames = (req, res) => {
    if(!req.body.updateGames){
        res.status(400).send({'err' : 'data missing'});
            return;
    }
    for (let game = 0; game < req.body.updateGames.length; game++){
        
        let query = {ProgramId: req.body.updateGames[game].ProgramId,
                     GameId: req.body.updateGames[game].GameId}
        Game.update(query,req.body.updateGames[game], { upsert: true }, (err, raw)=> {
            if(err){
                console.log(err);
            }
        });
    }
    res.send({});
}

exports.updateGame = (req, res) => {
    if(!(req.body.programId || req.body.gameId)){
        res.status(400).send({'err' : 'data missing'});
    }
    
    var conditions = {ProgramId: req.body.programId , GameId: req.body.gameId}
    Game.update(conditions, req.body.newGame, (err, doc) => {
        if(err){
            res.send({'err': 'Can\'t update at this point!'});
            return;
        }
        res.send({'msg': 'ok'})
    });
}

exports.getAllGamesByProgramId = (req, res) => {
    //todo add option for IsActive;
    if(!req.params.programId){
        res.status(400).send({'err' : 'Data is missing'});
    }

    Game.find({ ProgramId: req.params.programId }, {}, (err, games) => {
        if(err || !games){
            res.send({'err': 'Games not found!'});
            return;
        }
        res.send({ 'games': games });
    });
}

exports.getActiveGames = (req, res) => {
    Game.aggregate([ 
        {$match: {IsActive : true}},
        {$group: { _id : "$ProgramId", games: { $push: {
            _id:        "$_id",
            ProgramId: "$ProgramId",
            GameId: "$GameId",
            Time: "$Time",
            Date: "$Date",
            GuestTeam: "$GuestTeam",
            HomeTeam: "$HomeTeam",
            XTeam: "$XTeam",
            IsSingle: "$IsSingle",
            IsDouble: "$IsDouble",
            HomeRate: "$HomeRate",
            GuestRate: "$GuestRate",
            XRate: "$XRate",
            Result: "$Result",
            EventId: "$EventId",
            GameType: "$GameType",
            IsActive: "$IsActive",
            Type_name: "$Type_name"
        } } } }
      ], (err, games)=>{
        if(err){
            res.status(404).send({'err': 'No active games'});
            return;
        }else{
            res.send({'games': games});
        }
    })
}


exports.deleteGames = (req, res) => {
    if(req.body.pId){
        console.log('Going to delete --->');
        console.log(req.body.pId);
        Game.deleteMany({'ProgramId' : req.body.pId}, (err) => {
            if(err){
                console.log(err);
            }
            res.send({'Done': 'Deleted!'});
        })
    }
}