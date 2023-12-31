const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product=require('./models/product')
const User=require('./models/user')
const Cart=require('./models/cart')

const app = express();

const cors =require("cors");
app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const CartItem = require("./models/cartItem");



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req,res,next)=>{
  User.findByPk(1).then(user=>{
    req.user=user
    next()
  }).catch(err=>console.log(err))
})

app.use("/admin",cors(), adminRoutes);
app.use(shopRoutes);


Product.belongsTo(User)
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, {through: CartItem})

app.use(errorController.get404);



sequelize
  // .sync({force:true})
  .sync()
  .then((res) => {
     return User.findByPk(1)
    
  }).then(user=>{
    if(!user){
      return User.create({name:'sumanth',email:'test@tesr.com'})
    }
    return user
  })
  .then(user=>{
    return user.createCart()
    
  }).then(cart=>{app.listen(5000);})
  .catch((err) => {
    console.log(err);
  })


