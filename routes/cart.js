const { Router } = require('express');
const Cart = require('../models/carts');
const router = require("express").Router();



async function register_order(order,username){
    order_body = {}
    order_body['userId'] = username
    order_body['products'] = []
    for (key in order){
        temp = {}
        temp['productId'] = key
        temp['quantity'] = order[key]
        order_body['products'].push(temp)
    }

    let data = new Cart(order_body);
    let result = await data.save();

    resp.send(result);

}

router.post("/checkout/:username" , (req,resp)=>{
    resp.send(register_order(req.body, req.params.username))
    resp.send(req.body)

})


module.exports = router