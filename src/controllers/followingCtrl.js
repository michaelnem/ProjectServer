'use strict';

const mongoose = require('mongoose');
const Follow = mongoose.model('Follow');

exports.getAllFollowingByUserId = (req, res) => {
    if(!req.params.Uid){
        res.status(404).send({'err':'Data is missing'});
        return;
    }

    Follow.find({UId: req.params.Uid}, {_id: 0}, (err, Following) => {
        if(err){
            console.log(err);
        }
        res.send({'Following': Following});
    });
}

exports.getAllFollowersByUserId = (req, res) => {
    if(!req.params.Uid){
        res.status(404).send({'err':'Data is missing'});
        return;
    }

    Follow.find({FId: req.params.Uid}, {_id: 0}, (err, Following) => {
        if(err){
            console.log(err);
        }
        res.send({'Followers': Following});
    });
}

exports.saveNewFollowing = (req, res) => {
    if(!req.body.UId || !req.body.FId){
        res.status(404).send({'err':'Data is missing'});
        return;
    }
    let follow = Follow({UId: req.body.UId, FId: req.body.FId});
    follow.save(((err, doc) => {
        if(err){
            console.log(err);
            res.send({'msg': 'Unknow error', 'Saved': false})
        }
        res.send({'msg': 'Added', 'Saved': true});
    }));
}

exports.removeFollowing = (req, res) => {
    if(!req.body.UId || !req.body.FId){
        res.status(404).send({'err':'Data is missing'});
        return;
    }
    
    Follow.remove({UId: req.body.UId, FId: req.body.FId}, (err, doc) => {
        if(err){
            console.log(err);
        }
        // console.log(doc);
        res.send({'msg':'Remove Successful'});
    })

}