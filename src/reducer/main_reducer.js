let users = []
let user = {name:"",surname:"",age:"",gender:"Male",country:"United Kingdom",speaks:["English"],learns:["Spanish"]}
let initialstate = {users:users,
					//partner:null,
					user:user,
					InitReg:{show:false,edit:false},
          UsersWindow:{show:true}
          }


const main_reducer = (state = initialstate, action) => {
  switch(action.type){
  	case "newPartner":{
      if(!action.partnerId){
        return {...state,partner:null}
      }
  		let partnerId = action.partnerId
      let user = {...state.user}
      user.partnerId = partnerId
      let users = [...state.users]
      users.forEach((user)=>{
        if(user=>user.socketid == partnerId){
          user.messages.forEach(message=>message.unread=false)
          // user.partner = true
        }
      })
     
  		// let partner = state.users.filter(user=>user.name == partnerId)
      //partner.messages.forEach(message=>message.unread=false)
  		return {...state,user:user,users:users};
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
    case "deleteUser":{
      let user2 = action.user
      let users = state.users
      users=users.filter(user=>user.socketid!=user2.socketid)
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
    case "toggleUsersWindow":{
      let show = action.show
      return {...state,UsersWindow:{show:show}}
    }
    case "addMessage":{
      let msg = action.msg
      let message = {text:{__html:msg.text},time:msg.time,unread:true}
      let partner = state.users.find(user=>user.socketid==state.user.partnerId)
      if(msg.sender == state.user.socketid || partner && partner.socketid == msg.sender){
        message.unread = false
      }
      // let users = JSON.parse(JSON.stringify(state.users))
      let users = [...state.users]
      users = users.map(user=>{
        if(user.socketid != state.user.socketid){
          let user_perm = {...user}
          if(user.socketid == msg.sender){
            message.from = "partner"
            user_perm.messages.unshift(message)
            user_perm.chat=true
            return user_perm
          }
          if(user.socketid == msg.recipient){
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
    case "leftChat":{
      let users = [...state.users]
      let user = {...state.user}
      user.partnerId = null
      users = users.map(user=>{
        if(user.partnerId == action.partnerId){
          user.chat = false
          user.messages = []
        }
        return user
      })
      return {...state,user:user,users:users}
    }
    case "EXAMPLE":{
      console.log(1)
      let currentPost = state.posts.filter(post => post.id == 1 );
      console.log(currentPost[0]==state.posts[0])
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


