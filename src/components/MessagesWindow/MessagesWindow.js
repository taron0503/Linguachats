import React, {Component} from "react"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {isMobile} from "react-device-detect";
import ScrollToBottom from '../Helpers/ScrollToBottom';
import TypingIcon from '../Helpers/TypingIcon';
import MessageBoard from '../MessageBoard'
import {get_emoji_byName}  from '../Helpers/EmojiPicker'

import "./style.css"

import socket from "../../services/socket.js"


class MessagesWindow extends Component{


	componentWillUnmount=()=>{
		socket.off('send_message', this.handleOnMessage);
		this.props.meLeftChat(this.props.user.partnerId);
	}


	closeChat=()=>{
		socket.emit("left_chat",{user:this.props.user,partner:this.props.partner})
		this.props.meLeftChat()
		// this.props.changeStatus(this.props.user.socketid,"free")
		this.props.toggleMessagesWindow(false)
		this.props.toggleUsersWindow(true)
		this.props.toggleHeader(true)
		// this.props.newPartner();
	}

	collapseChat=()=>{
		this.props.toggleMessagesWindow(false)
		this.props.toggleUsersWindow(true)	
		this.props.toggleHeader(true)
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
		let partner = this.props.partner
		let user = this.props.user
		let MWbodyHeight = "calc(100 * var(--vh,1vh) - 37px - 44px)"//isMobile?"calc(100% - 37px - 44px)":"calc(100% - 37px - 44px)"
		return (
			<div className="MessagesWindow">
				<div className="MWheader">
					{(isMobile && !this.props.hideBackArrow) &&
					<button type="button" className="backButton" onClick={this.collapseChat}>
						<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					    <path fillRule="evenodd" d="M5.854 4.646a.5.5 0 0 1 0 .708L3.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"/>
					    <path fillRule="evenodd" d="M2.5 8a.5.5 0 0 1 .5-.5h10.5a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
					  </svg>  
					</button>
					}
					{partner.name}
					<button type="button" className="close" aria-label="Close" onClick={this.closeChat}>
					  <span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div style = {{height:MWbodyHeight}} className="MWbody">
				{this.props.children}
				<ScrollToBottom className="messagesContainer Cscroll">
					{partner.typing &&
						<div className = "chatMessageL">
								<div className="message_sender_name">
								{partner.name}
								</div>
								<TypingIcon size={6}/>
						</div>
					}
					{partner.messages.map((message,index)=>{
						return <div key={index} className = {message.from==="partner"?"chatMessageL":"chatMessageR"}>
							<div className="message_sender_name">
							{message.from==="partner"?partner.name:user.name}
							</div>
							{this.getEmojiIfOne(message.text)?<div className="chatMessageText" style={{"background":"white"}} dangerouslySetInnerHTML={this.getEmojiIfOne(message.text)}></div>:
							<div className="chatMessageText" dangerouslySetInnerHTML={message.text}></div>}
							<div className="message_time">{message.time}</div>
						</div>
						})
					}
				</ScrollToBottom>
				</div>
				<div className="MWfooter">
					<MessageBoard/>
				</div>
			</div>
			)
	}
}

const mapStateToProps = (state) => {
	state = state.main_reducer
	let partner = state.users.find(user=>user.socketid===state.user.partnerId)
  return {
    partner: partner,
    user:state.user,
    // users:state.users
  };
};

export default connect(mapStateToProps,actions)(MessagesWindow)