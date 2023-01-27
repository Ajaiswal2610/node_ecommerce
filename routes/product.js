// this file will contains all the routes 
const express = require('express');

const Product = require('../models/products');
const router = require("express").Router();
const connectEnsureLogin = require('connect-ensure-login');
router.use(express.urlencoded({extended:true}))

router.get("/", async (req, resp) => {
    let data = await Product.find();
    resp.render("homepage",{data});
})

// --------------Searching a particular product -----------------------
router.get("/products/:id", async (req, resp) => {
    let data = await Product.find(req.params);
    resp.send(data);
})

//  ------------------------Adding a new product ------------------------------->

router.get("/admin/addItem", connectEnsureLogin.ensureLoggedIn(),(req, resp) => {
    resp.render("productForm")
});

router.post("/admin", connectEnsureLogin.ensureLoggedIn(),async (req,resp)=>{
    let categories = req.body.categories.split(",")
    req.body.categories = categories
    let data = new Product(req.body);
    let result = await data.save();

    resp.send(result);
})

// // <----------------------------Updating a new product --------------------------------->


router.get("/admin/:id", async (req,resp)=>{
    let data = await Product.findOne(req.params)
    if (!data) return resp.status(404).send("Product Not found")
  
    resp.render("modifyProduct",{data:data,id:req.params.id})

    
})

router.post("/admin/:id", async (req,resp)=>{

    let categories = req.body.categories.split(",")
    req.body.categories = categories
    let data = await Product.updateOne(
        req.params,
        {$set:req.body}
    );
    resp.send(data)
})

// // <-------------------------------- Deleting a new product --------------------------------->

// router.delete("admin/delete/:_id",async (req,resp)=>{
//     // resp.send(req.params)
//     let data = await Product.deleteOne(req.params);
//     //  req.params is iteself a dictionary {_id:uruourotiu}
//     resp.send(data);

// })






// router.get('/search/:key', async (req,resp)=>{
//     let data = await Product.find(
//         //  finding for the multiple field 
//         {"$or":[
//             {"name":{$regex:req.params.key}},
//             {"brand":{$regex:req.params.key}},
//             {"Categoy":{$regex:req.params.key}}
//         ]
//     }
//     )
//     resp.send(data)
// })

module.exports = router;