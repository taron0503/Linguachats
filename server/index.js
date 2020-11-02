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
    user_data.time = Date.now()
  	clients.unshift(user_data)
  	io.emit("addUser",user_data)
  })

  socket.on("addUserToVideoChat",socketid=>{
    console.log(socketid)
    clients.forEach(client=>{
      if(client.socketid == socketid)
        client.rooms.push("videoChat")
    })
    io.emit("addUserToVideoChat",socketid)
  })

  socket.on("deleteUserFromVideoChat", socketid=>{
    clients.forEach(client=>{
      if(client.socketid == socketid){
        const index = client.rooms.indexOf("videoChat");
          if (index > -1) {
            client.rooms.splice(index, 1);
          }
      }
    })
    io.emit("deleteUserFromVideoChat",socketid)
  })

  socket.on("startTyping",data=>{
    io.to(data.partner.socketid).emit("startTyping",data.user)
  })

  socket.on("endTyping",data=>{
      io.to(data.partner.socketid).emit("endTyping",data.user)
    })
  
  socket.on("call-user", data => {
    console.log("call-user")
    let call_receiver = clients.find(client=>client.socketid===data.to)
    if(call_receiver && call_receiver.status==="talking"){
      socket.emit("answer-made",{status:"talking"})
    }


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

  socket.on("changeStatus",({socketid,status})=>{
    console.log(socketid)
    console.log(status)
    clients.forEach(client=>{
      if(client.socketid==socketid)
        client.status=status
    })
    socket.broadcast.emit("changeStatus",{socketid:socketid,status:status})
  })

  socket.on("videoOffOn",data=>{
    socket.to(data.to).emit("videoOffOn",data.OffOn);
  })
     
  });




http.listen(8000, () => {
  console.log('listening on *:8000');
});