const { Router } = require('express');
const Cart = require('../models/carts');
const product_model = require('../models/products')
const router = require("express").Router();
const connectEnsureLogin = require('connect-ensure-login');
const e = require('express');
var round = Math.round;
 



router.get("/cart",connectEnsureLogin.ensureLoggedIn(), async (req,resp)=>{
    const user = req.user.username

    let product_data = await product_model.find();
    product_data = JSON.parse(JSON.stringify(product_data));
    let cart_data = {}
    try{
        cart_data = await Cart.findOne({userId:user})
        cart_data = JSON.parse(JSON.stringify(cart_data))
        cart_data = cart_data['products']
    }
    catch{

    }

    product_data.forEach((item)=>{
        pid = item['id']
        try{
            cart_data.forEach((cart)=>{

                if (cart["productId"]==pid){
                    item["quantity"] = cart["quantity"]
                    item["total"] = cart["quantity"]*Number(item["price"])
                    console.log(item["quantity"],"quantity")
    
                }
            })
        }
        catch{}
        
    })

    console.log(product_data)
    resp.render("cart",{username:req.user.username, product_data:product_data})

})

router.post("/cart/add/:id",async (req, resp)=>{
    const user = req.user.username
    let user_cart = await Cart.findOne({userId:user});
    if (!user_cart){
        // create a new empty cart 
        await Cart.create(({
            userId:user,
            products: []
          }))
    }
        //  check if the products already available in the cart 
        // user.products
        // user.products({})
    // console.log(user_cart)
    let user_products = user_cart['products']
    let isalready = false;
    // check if the item already added in the cart 
    user_products.forEach(async (item)=>{
        if (item["productId"] == req.params.id){
            //  product already available just increase the count 
            item['quantity'] = item['quantity']+1
            isalready = true;
        }
    })
    if (isalready){
        console.log('item added')
        const data  = await Cart.updateOne({userId:user},{$set:{products:user_products}})
        resp.redirect('/cart')
    }
    else if (!isalready){
        // if not in cart add it 
        let product_order = {productId:req.params.id,quantity:1}
        user_products.push(product_order)
        const data  = await Cart.updateOne({userId:user},{$set:{products:user_products}})
        resp.redirect('/cart')
    }
})





router.post("/cart/remove/:id",async (req, resp)=>{
    const user = req.user.username
    let user_cart = await Cart.findOne({userId:user});
    if (!user_cart){
        // create a new empty cart 
        await Cart.create(({
            userId:user,
            products: []
          }))
    }
    else{
        //  check if the products already available in the cart 
        // user.products
        // user.products({})
        
        let user_products = user_cart['products']
        let isalready = false;
        // check if the item already added in the cart 
        user_products.forEach(async (item)=>{
            if((item["productId"] == req.params.id) && (item["quantity"]>1)){
                //  product already available just increase the count 
                item['quantity'] = item['quantity']-1
                isalready = true;
            }
        })
        if (isalready){
            console.log('item added')
            const data  = await Cart.updateOne({userId:user},{$set:{products:user_products}})
            resp.redirect('/cart')
        }
        else if (!isalready){
            // remove the product with quantity 1 
            Cart.updateOne({ userId: user }, { "$pull": { "products": { "productId": req.params.id } }}, { safe: true, multi:true }, function(err, obj) {
                console.log(obj)
            });
            // if cart is empty delete the document from cart 
            user_cart = await Cart.findOne({userId:user});
            if (user_cart['products'].length == 0){
                await Cart.remove(user_cart)
            }

            resp.redirect('/cart')
        }
    }
})

async function register_order(order){
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

    resp.redirect('/payment')

})


module.exports = router