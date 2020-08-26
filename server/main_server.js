var express = require('express');
var app = express();
var cors = require('cors')
const routes = require("./routes")
const mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true, useUnifiedTopology: true });



app.use(express.static('../build'));
app.use(express.json())
app.use(cors())
app.use("/", routes)



app.listen(8080);
console.log('Express server started');

