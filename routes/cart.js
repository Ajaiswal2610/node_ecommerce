const { Router } = require('express');
const Product = require('../models/carts');
const router = require("express").Router();



router.post("/checkout" , (req,resp)=>{
    resp.send(req.body)
})


module.exports = router