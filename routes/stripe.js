// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_KEY)
const express = require('express');
const Cart = require('../models/carts');
const Order = require('../models/orders')
const router = require("express").Router();

async function register_order(user){
    cart_data = await Cart.findOne({userId:user})
    cart_data = JSON.parse(JSON.stringify(cart_data))
    let data = new Order(cart_data);
    console.log(data)

    let result = await data.save();
    //  now empty the cart 
    let d = await Cart.deleteOne({userId:user})
    
    
    
}



router.post('/pay', function(req, resp){

    try{user = req.user.username}
    catch{
        resp.render("login")
    }
    try{
        register_order(user)
        resp.send('success')

    }
    catch(error){
        resp.send(error)
    }
    // // Moreover you can take more details from user
    // // like Address, Name, etc from form
    // stripe.customers.create({
    // email: req.body.stripeEmail,
    // source: req.body.stripeToken,
    // })
    // .then((customer) => {
     
    // return stripe.PaymentIntent.create({
    // amount: 56456, // Charing Rs 25
    // currency: 'usd',
    // customer: customer.id
    // });
    // })
    // .then((charge) => {

    // res.render("Successfully ordered") // If no error occurs
    // })
    // .catch((err) => {
    // res.send(err) // If some error occurs
    // });

    // 
})

module.exports = router
