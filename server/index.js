var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var moment = require('moment');


// app.use(express.static('public'));


// app.listen(8080);
// console.log('Express server started');

var people = require('./people.js');

// app.get('*', (req, res) => {
//   console.log(__dirname)
//   res.sendFile(__dirname + '../index.html');
// });

let clients = people;
let calling_timeout;


io.on('connection', (socket) => {
  socket.on("get_socketid",()=>{
  	socket.emit("send_socketid",socket.id)
  })
  
  console.log('a user connected');
  console.log(socket.id);

  socket.emit("AllOnlineUsers",clients)

  socket.on('disconnect', () => {
    console.log(socket.id);
  	let lefted_user = clients.find(user=>user.socketid==socket.id)
  	console.log(lefted_user)
  	clients = clients.filter(user=>user.socketid!=socket.id)
  	if(lefted_user){
      io.emit("deleteUser",lefted_user)
      console.log('user disconnected');
    }
  	
  });
  socket.on('chat message', (data) => {
  	if(data.socketid!="0"){
  		let time = moment().format('HH:mm');
  		io.to(data.socketid).emit("send_message",{sender:socket.id,
  												  recipient:data.socketid,
  												  text:data.msg,
  												  time:time})
  		io.to(socket.id).emit("send_message",{sender:socket.id,
  											  recipient:data.socketid,
  											  text:data.msg,
  											  time:time})
  	}else{
    // io.emit('send_message', data.msg)
	}
  });

  socket.on("left_chat", data=>{
    //console.log(data)
    io.to(data.partner.socketid).emit("left_chat",data.user)
    // io.to(socket.id).emit("left_chat",data.partner)
  })

  socket.on("user_data", user_data=>{
    // console.log(Date.now())
    user_data.time = Date.now()
  	clients.unshift(user_data)
  	// socket.emit("addUser",user_data)
    // user_data.time = Date.now()
  	io.emit("addUser",user_data)
  })

  socket.on("addUserToVoiceChat",socketid=>{
    console.log(socketid)
    clients.forEach(client=>{
      if(client.socketid == socketid)
        client.rooms.push("voiceChat")
    })
    io.emit("addUserToVoiceChat",socketid)
  })

  socket.on("deleteUserFromVoiceChat", socketid=>{
    clients.forEach(client=>{
      if(client.socketid == socketid){
        const index = client.rooms.indexOf("voiceChat");
          if (index > -1) {
            client.rooms.splice(index, 1);
          }
      }
    })
    io.emit("deleteUserFromVoiceChat",socketid)
  })

  socket.on("startTyping",data=>{
    io.to(data.partner.socketid).emit("startTyping",data.user)
  })

  socket.on("endTyping",data=>{
      io.to(data.partner.socketid).emit("endTyping",data.user)
    })
  
  socket.on("call-user", data => {
    console.log("call-user")
   socket.to(data.to).emit("call-made", {
     offer: data.offer,
     socket: socket.id
   });
   calling_timeout=setTimeout(()=>{ 
    socket.emit("no_answer")
    socket.to(data.to).emit("endCall");
    }, 60000);
  });

  socket.on("make-answer", data => {
   socket.to(data.to).emit("answer-made", {
     socket: socket.id,
     answer: data.answer,
     status: data.status,
   });
   clearTimeout(calling_timeout)
 });

  socket.on("endCall",socketid=>{
    socket.to(socketid).emit("endCall");
  })

  socket.on("icecandidate",(data)=>{
     console.log("icecandidate")
     socket.to(data.to).emit("icecandidate",data.candidate);
  })

  socket.on("changeStatus",status=>{
    clients.forEach(client=>{
      if(client.socketid==socket.id)
        client.status=status
    })
    io.emit("changeStatus",{socketid:socket.id,status:status})
  })

  socket.on("videoOffOn",data=>{
    socket.to(data.to).emit("videoOffOn",data.OffOn);
  })
     
  });




http.listen(8000, () => {
  console.log('listening on *:8000');
});