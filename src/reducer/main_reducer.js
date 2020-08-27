let users = []
let user = {name:"",surname:"",age:"",gender:"Male",country:"United Kingdom",profile_image_src:"avatarM.png",speaks:["English"],learns:["Spanish"]}
let initialstate = {users:users,
					loggedIn:false,
          UserIsOnline:false,
					user:user,
					InitReg:{show:false,edit:false},
          }


const main_reducer = (state = initialstate, action) => {
  switch(action.type){
  	case "newPartner":{
  		let partnerId = action.partnerId
      let main_user = {...state.user}
      main_user.partnerId = partnerId
      let users = [...state.users]
      users.forEach((user)=>{
        if(user.socketid === partnerId){
          user.messages.forEach(message=>message.unread=false)
          // user.partner = true
        }
      })    
  		// let partner = state.users.filter(user=>user.name == partnerId)
      //partner.messages.forEach(message=>message.unread=false)
  		return {...state,user:main_user,users:users};
    }
    case "deletePartner":{
      return {...state,user:{...state.user,partnerId:undefined}}
    }
    case "AllOnlineUsers":{
      let users = action.users
      users.forEach(user=>{user.messages=[]; user.fullname=user.name+" "+user.surname})
      return {...state,users:users}
    }
  	case "setUser":{
      let user = action.user
      user.partnerId=null
      return {...state,user:user}
  	}
  	case "addUser":{
      let users = [...state.users]
  		let user = action.user
      user.messages = []
      user.chat = false
      users.unshift(user)
  		return {...state,users:users}
  	}
    case "changeStatus":{
      let users = [...state.users]
      let socketid = action.socketid
      let status = action.status
      let main_user={...state.user}
      if(socketid===main_user.socketid){
        main_user.status=status
      }
      users = users.map(user=>{
        if(user.socketid===socketid)
          user={...user,status:status}
        return user
      })
      return {...state,user:main_user,users:users}
    }
    case "addUserToVoiceChat":{
      let users=[...state.users]
      let main_user = {...state.user}
      if(main_user.socketid===action.socketid){
        main_user.rooms.push("voiceChat")
      }
      users = users.map(user=>{
        if(user.socketid && user.socketid === action.socketid){
          if(!user.rooms.includes("voiceChat")){
            user.rooms.push("voiceChat")
          }
        }
        return user
      })
      return {...state,user:main_user,users:users}
    }
    case "deleteUserFromVoiceChat":{
      let users=[...state.users]
      let main_user = {...state.user}
      if(main_user.socketid === action.socketid){
        const index = main_user.rooms.indexOf("voiceChat");
          if (index > -1) {
            main_user.rooms.splice(index, 1);
          }
      }
      users = users.map(user=>{
        if(user.socketid === action.socketid){
          const index = user.rooms.indexOf("voiceChat");
          if (index > -1) {
            user.rooms.splice(index, 1);
          }
        }
        return user
      })
      return {...state,user:main_user,users:users}
    }
    case "deleteUser":{
      let user2 = action.user
      let users = state.users
      users=users.filter(user=>user.socketid!==user2.socketid)
      return {...state,users:users}
    }
    case "startTyping":{
      let users = [...state.users]
      users=users.map(user=>{
        if(user.socketid === action.partnerId){
          user={...user}
          user.typing=true
        }
        return user
      })
      return {...state,users:users}
    }
    case "endTyping":{
      let users = [...state.users]
      users=users.map(user=>{
        if(user.socketid === action.partnerId){
          user={...user}
          user.typing=false
        }
        return user
      })
      return {...state,users:users}
    }
    case "sortUsers":{
      let field = action.field
      let reverse = action.reverse
      let users = [...state.users]
      users=users.sort((user1,user2)=>{
        user1 = user1[field]
        user2 = user2[field]
        if(field === "time" || field === "age"){
          user1 = parseInt(user1)
          user2 = parseInt(user2)
        }
        if(user1<user2)
          return reverse?1:-1
        if(user1>user2)
          return reverse?-1:1
        return 0
      })
      return {...state,users:users}
    }
  	case "toggleInitReg":{
  		let show = action.show
      let InitReg = {...state.InitReg}
      InitReg.show = show
  		return {...state,InitReg:InitReg};
  	}
    case "toggleInitRegToEdit":{
      let edit = action.edit
      let InitReg = {...state.InitReg}
      InitReg.edit = edit
      return {...state,InitReg:InitReg};
    }
    case "turnLoggedIn":{
      let loggedIn = action.loggedIn
      return {...state,loggedIn:loggedIn}
    }
    case "addMessage":{
      let msg = action.msg
      let message = {text:{__html:msg.text},time:msg.time,unread:true}
      let partner = state.users.find(user=>user.socketid===state.user.partnerId)
      if(msg.sender === state.user.socketid || (partner && partner.socketid === msg.sender)){
        message.unread = false
      }
      // let users = JSON.parse(JSON.stringify(state.users))
      let users = [...state.users]
      users = users.map(user=>{
        if(user.socketid !== state.user.socketid){
          let user_perm = {...user}
          if(user.socketid === msg.sender){
            message.from = "partner"
            user_perm.messages.unshift(message)
            user_perm.chat=true
            return user_perm
          }
          if(user.socketid === msg.recipient){
            message.from = "user"
            user_perm.messages.unshift(message)
            user_perm.chat=true
            return user_perm
          }
        }
        return user
      })
      return {...state,users:users}
    }
    case "meLeftChat":{
      let users = [...state.users]
      let main_user = {...state.user}
      users = users.map(user=>{
        if(user.socketid === main_user.partnerId){
          user.chat = false
          user.messages = []
        }
        return user
      })
      main_user.partnerId=undefined
      return {...state,user:main_user,users:users}
    }
    case "userLeftChat":{
      let users = [...state.users]
      let mainuser = {...state.user}
      if(mainuser.partnerId === action.socketid)
            mainuser.partnerId = undefined
      users = users.map(user=>{
        if(user.socketid === action.socketid){
          user.chat = false
          user.messages = []
        }
        return user
      })
      return {...state,user:mainuser,users:users}
    }
    case "EXAMPLE":{
      //console.log(1)
      let currentPost = state.posts.filter(post => post.id === 1 );
      //console.log(currentPost[0]===state.posts[0])
      currentPost[0].likes++;
       let a = {...state, posts: [ ...state.posts,currentPost[0],state.posts[1] ]} 
       debugger
      return a
    }
    default:
      return state;
 }
}

export default main_reducer


