const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
    {    
        id:{type:String, required:true},
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true, },
        categories: { type: Array },
        price: { type: String, required: true },
        
      },
      { timestamps: true }


);

const product_model  = mongoose.model('products', productSchema)
module.exports = product_model;