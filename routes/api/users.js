const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../../configs/config");
const User = require("../../models/user");


//   api/users/register
router.post("/register",(req,res)=>{
    User.findOne({ email:req.body.email}).then((user)=>{
        if(user){
            return res.status(400).json("email already exists");
        }else{
            const newUser = new User({
                name:req.body.name,
                password:req.body.password,
                email:req.body.email,
                identity:req.body.identity
            })
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;

                    newUser.password = hash;

                    newUser.save()
                           .then(user => res.json(user))
                           .catch(err => res.json(err))
                });
            });
        }
    })
})


//    api/users/login
router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user=> {
            if(!user){
                return res.status(404).json("User not found");
            }

            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                    if(isMatch){
                        const rule = {
                            id:user.id, 
                            name:user.name,
                            avatar:user.avatar,
                            identity:user.identity
                        };

                        jwt.sign(rule, config.secret, {expiresIn:3600}, (err,token)=>{
                            if(err) throw err;
                            res.json({success:true, token:"Bearer " + token})
                        });
                        
                    }else{
                        return res.status(400).json({msg:"password error"})
                    }
                  })
        })
})

module.exports = router;