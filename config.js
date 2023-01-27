const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config();
const connectdb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('db connected !!!!!')

    }
    catch (err){
        console.log('failed to connect db',err)
    }

}

module.exports = connectdb;