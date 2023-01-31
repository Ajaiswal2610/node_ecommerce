const { Router } = require('express');
const Cart = require('../models/carts');
const product_model = require('../models/products')
const router = require("express").Router();
const connectEnsureLogin = require('connect-ensure-login');
var round = Math.round;
 



router.get("/cart",connectEnsureLogin.ensureLoggedIn(), async (req,resp)=>{
    let data = await product_model.find();
    resp.render("cart",{username:req.params.username, data:data})
})

router.post("/cart/add/:id",async (req, resp)=>{
    console.log(req.user)
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
            let product_order = {productId:req.params.id,quantity:1}

            // const index = Array(product_order).indexOf(product_order)
            // console.log(index)
            // user_products.splice(index,1)
            // const data  = await Cart.updateOne({userId:user},{$set:{products:user_products}})
            resp.redirect('/cart')
        }
    }
})

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