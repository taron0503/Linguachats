let initialstate = {UsersWindow:{show:true},
					Header:{show:true},
				    MessagesWindow:{show:true}}

const WindowToggle = (state = initialstate, action) => {
  switch(action.type){
  	case "toggleUsersWindow":{
      let show = action.show
      return {...state,UsersWindow:{show:show}}
    }
    case "toggleHeader":{
      let show = action.show
      return {...state,Header:{show:show}}
    }
    case "toggleMessagesWindow":{
      let show = action.show
      return {...state,MessagesWindow:{show:show}}
    }

    default:
      return state;
 }
}

export default WindowToggle


