import React, {Component} from "react"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {EmojiPicker,get_emoji_byName}  from '../Helpers/EmojiPicker'
import ContentEditable from 'react-contenteditable'
import ScrollToBottom from '../Helpers/ScrollToBottom';
import "./style.css"

import socket from "../../services/socket.js"


class MessageBoard extends Component{
	constructor(props){
		super(props)
		this.contentEditable = React.createRef();
		this.state = {msg: "",range:undefined};
	}

	componentDidMount=()=>{
		let that = this
		this.contentEditable.current.focus()
		this.contentEditable.current.addEventListener('input',()=>{
			that.setState({msg: that.contentEditable.current.innerHTML});
			that.props.hide_EmojiPicker()})
	}

	componentDidUpdate(prevProps){
		if(prevProps.partner!=this.props.partner){
			this.setState({msg:""})
		}
		this.contentEditable.current.focus()
	}

	handleChange = evt => {
	  let range;
	  let sel = window.getSelection();
	  if (sel.rangeCount) {
	      range = sel.getRangeAt(0);
	  }
	  // this.props.hide_EmojiPicker()
      this.setState({msg: evt.target.value,range:range});
	};

	handleClick = evt =>{
		// if(document.getSelection()){
		// 	console.log(document.getSelection().getRangeAt(0));
		// 	console.log(document.getSelection().anchorOffset);
		// }
		let range;
		let sel = window.getSelection();
	    if (sel.rangeCount) {
	      range = sel.getRangeAt(0);
	    }
	    if( evt.key == "Backspace"  ){
		    var selection = document.getSelection();
		    // if caret is at the begining of the text node (0), remove previous element
		    if( selection && selection.anchorOffset == 0){
		    	console.log(selection.anchorNode.previousSibling)
		    	if(selection.anchorNode.previousSibling){
		          selection.anchorNode.previousSibling.parentNode.removeChild(selection.anchorNode.previousSibling)
		    	}else if(selection.anchorNode.parentNode.previousSibling){
		    	  selection.anchorNode.parentNode.previousSibling.parentNode.removeChild(selection.anchorNode.parentNode.previousSibling)
		    	}
		 	}
	    }
		if(evt.key == "Delete") {
	        var selection = document.getSelection();
	        if(selection && selection.anchorNode.length == selection.anchorOffset){
	        	if(selection.anchorNode.nextSibling){
		          selection.anchorNode.nextSibling.parentNode.removeChild(selection.anchorNode.nextSibling)
		    	}else if(selection.anchorNode.parentNode.nextSibling){
		    	  selection.anchorNode.parentNode.nextSibling.parentNode.removeChild(selection.anchorNode.parentNode.nextSibling)
		    	}
	        }
	    }
		this.setState({range:range,msg:this.contentEditable.current.innerHTML})
		if(evt.key == "Enter" && !evt.shiftKey) {
					evt.preventDefault()
					this.props.hide_EmojiPicker()
	        this.sendMessage()
	    }
	}

  getEmojiIfOne(msg){
  	console.log(msg)
  	let emojiSpan = msg.match(/^<span[^<]*<\/span>$/m)
  	if(emojiSpan){
  		let coords = emojiSpan[0].match(/.*\) ([^p]*)px ([^p]*)px/m)
  		let emoji = "emoji"+(-coords[1]/20)+(-coords[2]/20)
  		console.log(emoji)
  		return emoji
  	}
  	return
  }


	sendMessage=()=>{
		let msg = this.state.msg
		if(!msg)
			return
		let emoji 
		if(this.getEmojiIfOne(msg))
			emoji=this.getEmojiIfOne(msg)
		let partner = this.props.partner
		let socketid=partner.socketid
		socket.emit('chat message', {msg:msg,socketid:socketid})
		this.setState({msg:""})
	}


	addEmoji=(emoji)=>{
		let emojiOb = get_emoji_byName(emoji)
		
	    let span = document.createElement("span");
	    span.setAttribute("contentEditable","false")
	    span.setAttribute("style",`background:${emojiOb.url} ${emojiOb.left} ${emojiOb.top} no-repeat;
	    									background-size:${emojiOb.backgroundSize};
											display:inline-block;
											width:20px;
											height:20px;`)
	    // console.log(span)
	    this.contentEditable.current.focus()
	    let sel = window.getSelection();
		if (sel.rangeCount) {
	      let range = this.state.range;
	      if(!range){
	      	range = document.createRange();
			range.setStart(this.contentEditable.current, 0);
			range.setEnd(this.contentEditable.current, 0);
	      }
	      range.insertNode(span)
	      range = range.cloneRange();
          range.setStartAfter(span);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
	      console.log(range)
	     // range.collapse(true)
	      
	      this.setState({msg:this.contentEditable.current.innerHTML,range:range})
	      console.log(this.state.range)
	  	}
	}

	

	render(){
		return (
			<React.Fragment>
				<div className="type_msg_wrapper">
				<ScrollToBottom>
					<ContentEditable
		              innerRef={this.contentEditable}
		              html={this.state.msg} // innerHTML of the editable div
		              disabled={false}       // use true to disable editing
		              onChange={this.handleChange} // handle innerHTML change
		              onClick={this.handleClick} // handle innerHTML change
		              onKeyDown={this.handleClick} // handle innerHTML change
		              onInput={this.handleInput} // handle innerHTML change
		              className="ContentEditable Cscroll"
		            />
		    </ScrollToBottom>
				</div>
				<div className = "messButtonsWrapper">
				<EmojiPicker addEmoji={this.addEmoji} 
				             EmojiPicker_show={this.props.EmojiPicker_show}
				             show={this.props.show_EmojiPicker}
				             hide={this.props.hide_EmojiPicker}/>
				<button className="btn btn-primary" id="send_button" onClick={this.sendMessage}>Send</button>
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps = (state) => {
	let EmojiPicker = state.EmojiPicker
	let partner = state.main_reducer.users.find(user=>user.socketid==state.main_reducer.user.partnerId)
  return {
    partner: partner,
    user:state.main_reducer.user,
    EmojiPicker_show:EmojiPicker.show
  };
};

export default connect(mapStateToProps,actions)(MessageBoard)