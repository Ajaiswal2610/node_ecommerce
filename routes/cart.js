const { Router } = require('express');
const Cart = require('../models/carts');
const router = require("express").Router();
var round = Math.round;


async function register_order(order,username){
    order_body = {}
    order_body['userId'] = username
    order_body['products'] = []
    try{
        for (key in order){
            temp = {}
            temp['productId'] = key
            temp['quantity'] = round(order[key])
            order_body['products'].push(temp)
        }
    }
    catch(error){
        console.log(error)
    }

    try{
        let data = new Cart(order_body);
        let result = await data.save();
        return result
    }
    catch(error){
        return error
    }
  

}

router.post("/checkout/:username" , (req,resp)=>{
    let result = (register_order(req.body, req.params.username))
    resp.send(result)

})


module.exports = router