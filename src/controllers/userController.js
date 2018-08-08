'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const USR_TOKEN_EXPIRE = 86400;
const USR_TOKEN_HASH = 'App-scoreshshjohnsh';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Profile = mongoose.model('Profile');


function convertStringToNumbers(str){
    let newStr = '';
    for(let i = 0; i<str.length; i++){
        newStr += str.charCodeAt(i).toString(); 
    }
    return newStr;
}

class WebUser{
    constructor(FName,LName,BirthDate,AllowToFollow,Img,Email,UId){
        this._id = UId;
        this.FirstName = FName;
        this.LastName = LName;
        this.BirthDate = BirthDate;
        this.AllowToFollow = AllowToFollow
        this.Img = Img;
        this.Email = Email;
        this.Token = this.buildUserToken();
    }
    
    buildUserToken(){
        return jwt.sign({
            _id: this._id,
            FirstName: this.FirstName,
            LastName: this.LastName,
            BirthDate: this.BirthDate,
            Img: this.Img,
            Email: this.Email
        }, USR_TOKEN_HASH,{
            expiresIn: USR_TOKEN_EXPIRE
        });
    }
    
}

exports.UserTokenValid = (req ,res) => {
    if(!req.body.userToken){
        res.status(404).send({'err' : 'User data is missing'});
        return;
    }
    jwt.verify(req.body.userToken, USR_TOKEN_HASH, (err,doc) => {
        if(err){
            res.send({'err': err.message});
        }else{
            res.send({'msg': 'token is valid','user': doc});
        }
    });

}

exports.Login = (req, res) => {
    if(!req.body.user){
        res.status(404).send({'err': 'User login details is missing'});
        return;
    }

    let tempUser = User(req.body.user);

    if(!tempUser.Password || !tempUser.Email){
        res.status(404).send({'err' : 'User login details is missing'});
        return;
    }

    User.findOne({Email: tempUser.Email} , (err, user) => {
        if(err || !user){
            res.send({'err': 'Invalid user'});
        }else if(bcrypt.compareSync(tempUser.Password, user.Password)){
                Profile.findOne({_id:user._id}, { _id: 0} ,(err, doc) => {
                    if(err){
                        console.log(err);
                        res.send({'err':err});
                    }
                    else{
                        let loginUser = new WebUser(doc.FirstName, doc.LastName,
                                                    doc.BirthDate, doc.AllowToFollow, 
                                                    doc.Img, user.Email, user._id);
                        res.send({'User': loginUser});
                    }
                })
        }else{
            res.send({'err': 'Wrong User details'});
        }
    });
}

exports.ValidNewUser = (req, res, next) => {
    
    if(!req.body.newUser){
        req.error = {'err' : 'User register details is missing'};
        return;
    }
    
    req.body.newUser._id = convertStringToNumbers(req.body.newUser.Email);
    req.body.newUser.BirthDate = Date(req.body.newUser.BirthDate);
    User.findOne(
        { $or:[
            { _id : req.body.newUser._id },
            { Email: req.body.newUser.Email }
        ]},(err, user) => {
            if(err){
                req.error = err;
            }
            else if(user){
                req.error = {'err' : 'User already exist'};
                req.userExist = true; 
            }else{
                // todo change this build to somewhere else
                req.userExist = false;
                req.body.newUser.Role = 'User';
                req.body.newUser.Password = bcrypt.hashSync(req.body.newUser.Password, 10);
                
                req.body.newUser.Token = jwt.sign({
                    _id: req.body.newUser._id,
                    name: req.body.newUser.UserName        
                }, USR_TOKEN_HASH,{
                    expiresIn:USR_TOKEN_EXPIRE
                });

            }
            next();
        });
}

exports.Register = (req, res) => {
    if(req.error || req.userExist){
        res.status(404).send(req.error);
        return;
    }
    
    let profile = Profile(req.body.newUser);
    let user = User(req.body.newUser);
    profile.save((err, doc) => {
        if(err){
            res.status(404).send({'err': err});
        }else{
            user.save((err, succ) => {
                if(err){
                    res.status(404).send({'err': err});
                }else{
                    let User = new WebUser(profile.FirstName,profile.LastName,
                                           profile.BirthDate, profile.AllowToFollow, 
                                           profile.Img, user.Email, user._id);

                    res.send({'msg': 'User have been create','User': User});
                }
            });
        }
    });
}

exports.ProfileUpdate = (req, res) => {
    if(!req.body.userUpdates){
        res.status(404).send({'err':'Data is missing'});
        return;
    }
    const profile = Profile(req.body.userUpdates);
    
    Profile.update({_id: req.body.userUpdates._id}, profile,
                   function(err, row){
                       
        if(err){
            res.status(404).send({'err':'Some error in updateing'});
        }else{
            let newUser = new WebUser(profile.FirstName, profile.LastName, 
                                      profile.BirthDate, profile.AllowToFollow, profile.Img, 
                                      req.body.userUpdates.Email, profile._id);
            res.send({'msg': 'User has updated', 'err': null, 'newProfile': newUser});
        }
    });
}

exports.rateProfileUpdate = (req, res) => {
    if(!req.body.ratingDetails){
        res.status(404).send({'err': 'Data is missing'});
        return;
    }
    Profile.findById(req.body.ratingDetails.PUid, (err, profile) => {
        profile.Rating += parseInt(req.body.ratingDetails.point);
        profile.Raters.push(req.body.ratingDetails.RUid);
        profile.save(function(err, m){
            if(err){
                res.status(404).send({'err': 'Data is missing'});
            }else{
                res.send({'msg': 'Rate accepted'});
            }
        })
    })
}

exports.getUsersAllowToFollow = (req, res) => {
    if(!req.params.Uid){
        res.status(404).send({'err':'Data is missing'});
        return;
    }

    Profile.find({AllowToFollow: true, _id: {$ne: req.params.Uid}},  (err, profiles) => {
        if(err){
            console.log(err);
            res.status(404).send({'err': 'Some error in updateing'});
            return;
        }
        res.send({'Profiles': profiles});
    });
}


