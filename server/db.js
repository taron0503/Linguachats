const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
    name:String,
    surname:String,
    age:Number,
    gender:String,
    country:String,
    speaks:[String],
    learns:[String]
});

mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true });

const User = mongoose.model("User", userScheme);
const user = new User({
    name:"Elon",
    surname:"Musk",
    age:"45",
    gender:"Male",
    country:"United Kingdom",
    speaks:["English"],
    learns:["Spanish"]
});

user.save(function(err){
    mongoose.disconnect();  // отключение от базы данных
      
    if(err) return console.log(err);
    console.log("object saved", user);
});



