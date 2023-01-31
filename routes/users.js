
const Users = require('../models/users');
const bcrypt = require('bcryptjs');
const express = require('express');
const ejs = require('ejs');
const passport = require('passport');
const connectEnsureLogin = require('connect-ensure-login');
const product_model = require('../models/products');
const user_model = require('../models/users');
const router = require("express").Router();
router.use(express.urlencoded({extended:true}))








const log_middleware = passport.authenticate("local",{
    failureRedirect:"/login",
    // successRedirect: '/admin'
        })

router.get("/account",  (req,resp)=>{
    resp.render("index")
    })

router.get("/register",  (req,resp)=>{
        resp.render("register")
    
        })

router.get("/login", (req,resp)=>{
    resp.render("login")
})


router.post("/login",log_middleware, async (req,resp)=>{

    let data = await user_model.findOne({username:req.body.username})
    
    if (data.isAdmin==1){
        resp.redirect("/admin")
    }
    else {
        resp.redirect('/cart')
    }
    
})


router.get('/admin', connectEnsureLogin.ensureLoggedIn(), (req, res) =>
  res.render('dashboard', { title: 'Dashboard Page' })
);

router.post("/register", async (req,resp)=>{
    const user = await Users.findOne({username:req.body.username})
    if (user) return resp.status(400).send("user already exist")
    const secure_pass= await bcrypt.hash(req.body.password,10)
    req.body.password = secure_pass;
    const newuser = Users.create(req.body);
    resp.status(201).send("Succesfully registered")
 
})


router.get("/logout", function(req,resp, next){
    req.logout(function(err){
        if (err){
            return next(err);
        }
        resp.redirect("/")
    })
})

module.exports = router;
