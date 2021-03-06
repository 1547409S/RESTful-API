const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'email already exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err,hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                });
                user
                .save()
                .then(result =>{
                    console.log(result);
                    res.status(201).json({
                        message: 'User created.'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    });
                });
            }
        });
        }
        
    });
     
};

exports.users_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1) {
            // Do not add below code to avoid exposing allowed emails to brutforce
            // return res.status(404).json({
            //     message: 'Mail not found, user doesn\'t exist'
            // });
            return res.status(401).json({
                message: 'Login failed-1'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Login failed-2'
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Login successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Login failed-3'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
};

exports.users_delete_user = (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};