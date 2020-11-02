var express = require('express');
var app = express();
var cors = require('cors')
var cookieParser = require('cookie-parser')
const routes = require("./routes")
const mongoose = require("mongoose");


mongoose.set('useFindAndModify', false);
// mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://taron:0000@cluster0.bitor.mongodb.net/usersdb?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });



app.use(express.static('../build'));

app.use(express.json())
let whitelist = ['http://localhost:3000','http://localhost:80'];
let corsOptions = {
	origin: (origin, callback)=>{
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},credentials: true
}
app.use(cors(corsOptions));
app.use(cookieParser())
// app.use(cors())
app.use("/", routes)


app.listen(8080);
console.log('Express server started');
