

const EmojiPicker = (state = {show:false}, action) => {
  switch(action.type){
  	case "show":{
  		return {show:true};
  	}
  	case "hide":{
  		return {show:false};
  	}
    
    default:
      return state;
 }
}

export default EmojiPicker


