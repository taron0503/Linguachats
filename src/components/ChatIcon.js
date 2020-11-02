import React, {Component} from "react"
import styled from 'styled-components'

class ChatIcon extends Component{
  chatIconWrapper= styled.div`
		position:relative;
		img {width:${this.props.size}px};
	`;

// .chaticon img{
// 	width:20px;
// }

  newMessageIcon=styled.div`
		position: absolute;
		left:11px;
		width:12px;
		height: 12px;
		float: right;
		background-color: red;
		border-radius: 50%;
		text-align: center;
		color: white;
		font-size: 10px;
		font-weight: bold; 
	`
	render(){
	    let unread_messages=this.props.unread_messages?this.props.unread_messages:0
        let imgsrc=this.props.imgsrc
	    let img = require("../images/"+imgsrc)	
		return(			
		    <this.chatIconWrapper style={this.props.styles}>
					{unread_messages>0 && <this.newMessageIcon>{unread_messages}</this.newMessageIcon>}
				   <img alt="ChatIcon" src={img}/>	
				</this.chatIconWrapper>
		   	
			)
	}
}		
export default ChatIcon