import React, {Component} from "react"
import { connect } from 'react-redux';
import ScrollToBottom from '../Helpers/ScrollToBottom';
import MessageBoard from '../MessageBoard'
import {get_emoji_byName}  from '../Helpers/EmojiPicker'

import "./style.css"

import socket from "../../services/socket.js"


class MessagesWindow extends Component{

	closeChat=()=>{
		socket.emit("left_chat",{user:this.props.user,partner:this.props.partner})
		// this.props.newPartner();
	}

	getEmojiIfOne(msg){
  	// console.log(msg.__html)
  	let emojiSpan = msg.__html.match(/^<span[^<]*<\/span>$/m)
  	if(emojiSpan){
  		let coords = emojiSpan[0].match(/.*\) ([^p]*)px ([^p]*)px/m)
  		let emoji = "emoji"+(-coords[2]/20)+(-coords[1]/20)
  		let emojiOb = get_emoji_byName(emoji,40)
		
	    let span = document.createElement("span");
	    span.setAttribute("contentEditable","false")
	    span.setAttribute("style",`background:${emojiOb.url} ${emojiOb.left} ${emojiOb.top} no-repeat;
	    									background-size:${emojiOb.backgroundSize};
											display:inline-block;
											width:40px;
											height:40px;`)
	    // console.log(emojiOb)
  		return {"__html":span.outerHTML}
  	}
  	return
  }

	render(){
		// console.log(this.props.partner)
		let partner = this.props.partner
		let user = this.props.user
		return (
			<div className="MessagesWindow">
				<div className="MWheader">
					{partner.name}
					{partner.chat && <button type="button" className="close" aria-label="Close" onClick={this.closeChat}>
					  <span aria-hidden="true">&times;</span>
					</button>}
				</div>
				<ScrollToBottom className="MWbody Cscroll">
				{/*<br/>*/}
				{partner.messages.map((message,index)=>{
					return <div key={index} className = {message.from=="partner"?"chatMessageL":"chatMessageR"}>
						<div className="message_sender_name">
						  {message.from=="partner"?partner.name:user.name}
						</div>
						{this.getEmojiIfOne(message.text)?<div className="chatMessageText" style={{"background":"white"}} dangerouslySetInnerHTML={this.getEmojiIfOne(message.text)}></div>:
						<div className="chatMessageText" dangerouslySetInnerHTML={message.text}></div>}
						<div className="message_time">{message.time}</div>
					</div>
					})
				}
				</ScrollToBottom>
				<div className="MWfooter">
					<MessageBoard/>
				</div>
			</div>
			)
	}
}

const mapStateToProps = (state) => {
	state = state.main_reducer
	let partner = state.users.find(user=>user.socketid==state.user.partnerId)
	// console.log(partner)
  return {
    partner: partner,
    user:state.user,
    // users:state.users
  };
};

export default connect(mapStateToProps)(MessagesWindow)