
const express = require('express');
const dbconnect = require("./config");
const passport = require('passport');
dbconnect();
const product_route = require('./routes/product')
const cart_route = require('./routes/cart')
const user_route = require('./routes/users');
const { initializingPassport } = require('./passportConfig');
const expressSession = require('express-session')
const app = express();
app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}));
app.use(express.static(__dirname+'/static'))
initializingPassport(passport)
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs")

app.use(express.json());


// ------------------- Listing all the products -------------------------------





app.use('/', product_route)
app.use('/',cart_route)
app.use('/',user_route)
app.get('*', (req,resp)=>{
    resp.render("notfound")
})
app.listen(4000);

