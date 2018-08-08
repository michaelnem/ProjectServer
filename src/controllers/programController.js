'use strict';

const mongoose = require('mongoose');
const Program = mongoose.model('Program');
   
exports.getAllPrograms = (req, res) => {
    Program.find({}, {'_id': 0}, function(err,data){
        if(err)
            res.send(err);
        else{
            res.send({ 'programs': data });
        }
    });
}
    
exports.getProgramById = (req, res) => {    
    Program.find({ programNum: req.params.programId }, { '_id': 0 },
        function(err, data){
        res.send({ 'program': data });
    });
};

exports.addNewPrograms = (req, res) => {
    if (!req.body.newPrograms){
        res.status(404).send({'err' : 'data missing'});
        return;
    }
    try{
        Program.insertMany(req.body.newPrograms);
    }catch(e){
        res.send({'err': 'faild to insert data'});
    }finally{
        res.send({'msg': 'ok'});
    }
}

exports.updatePrograms = (req, res) => {
    if(!req.body.updatePrograms){
        res.status(404).send({'err' : 'data missing'});
        return;
    }

    for (let program = 0; program < req.body.updatePrograms.length; program++){
        let query = {ProgramId: req.body.updatePrograms[program].ProgramId}
        Program.update(query, req.body.updatePrograms[program], { upsert: true }, (err, raw)=> {
            if(err){
                console.log(err);
            }
        });
    }

    res.send({'msg': 'ok'});
}

