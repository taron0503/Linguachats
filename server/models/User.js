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

module.exports = mongoose.model("User", userScheme)