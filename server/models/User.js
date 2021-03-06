const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({
    name:String,
    surname:String,
    age:Number,
    gender:String,
    country:String,
    profile_image_src:String,
    speaks:[String],
    learns:[String],
    createdAt: {type: Date, default: Date.now},
    lastVisit: {type: String}
});


module.exports = mongoose.model("User", userScheme)