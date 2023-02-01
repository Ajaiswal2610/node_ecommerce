// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_KEY)
const express = require('express');
const Cart = require('../models/carts');
const Order = require('../models/orders')
const router = require("express").Router();
const bodyparser = require('body-parser') 

router.use(bodyparser.urlencoded({extended:false}))
router.use(bodyparser.json())
async function register_order(user){
    cart_data = await Cart.findOne({userId:user})
    cart_data = JSON.parse(JSON.stringify(cart_data))
    let data = new Order(cart_data);
    console.log(data)

    let result = await data.save();
    //  now empty the cart 
    let d = await Cart.deleteOne({userId:user})
    
    
    
}



router.post("/pay", async (req, res) => {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        
                    },
                    unit_amount: product.amount * 100,
                },
                quantity: product.quantity,
            },
        ],
        mode: "payment",
        success_url: `http://localhost:4500/success.html`,
        cancel_url: `http://localhost:4500/cancel.html`,
    });

    res.json({ id: session.id });
});
module.exports = router
