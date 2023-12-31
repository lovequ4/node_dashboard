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

//    api/users
router.get("",(req,res)=>{
    User.find()
        .select('name email identity')
        .then(users=>{
            if(!users){
                return res.status(404).json({msg:"No users found"});
            }
            res.json(users);
        })
        .catch((err) => res.status(400).json(err)); 
})



// put api/users/edit
router.put('/edit/:id', (req,res)=>{
    const user = {};

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.identity) user.identity = req.body.identity;
   
   User.findOneAndUpdate(
        {_id:req.params.id},
        {$set:user},
        {new:true}
    ).then(user => res.json(user))
})

// delete api/users/delete
router.delete('/delete/:id', (req,res)=>{
    User.findByIdAndRemove(req.params.id)
        .then(user => 
            res.json(user))
        .catch(err =>{
            res.status(404).json(err)
        })
})

module.exports = router;