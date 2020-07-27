import React, {Component} from "react"
import UsersWindow from "./UsersWindow"
import MessagesWindow from "./MessagesWindow"
import {isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import * as actions from '../actions';

import socket from "../services/socket.js"

class TextChat extends Component{

	componentDidMount=()=>{
		socket.on('send_message', this.handleOnMessage);
	}

	componentWillUnmount=()=>{
    socket.off('send_message', this.handleOnMessage);
   }

	handleOnMessage=(msg)=>{
		this.props.addMessage(msg)
		this.props.endTyping(this.props.partner.socketid)
	}

	render(){
		let partner = this.props.partner
		return (
			<div className="container-fluid TextChat">
			  <div className="row no-gutter">
			    <div className="col-sm-4">
			    {this.props.UsersWindow.show && <UsersWindow/>}
			    </div>
			    <div className="col-sm-8">
			    {(isMobile && this.props.MessagesWindow.show && partner) &&
			    	<MessagesWindow partner={partner}/>
			    }
			    {(!isMobile && partner) &&
			      <MessagesWindow partner={partner}/>
			    }
			    {(!isMobile && !partner) &&
			      <div className="EmptyMessageWindow">Find someone to talk</div>
			    }
			    </div>
			  </div>
			</div>

			)
	}
} 

const mapStateToProps = (state) => {
	let WindowToggle = state.WindowToggle
	state = state.main_reducer
	let partner = state.users.find(user=>user.socketid===state.user.partnerId)
  return {
  	UsersWindow:WindowToggle.UsersWindow,
  	MessagesWindow:WindowToggle.MessagesWindow,
    partner:partner,
    users:state.users,
  };
};

export default connect(mapStateToProps,actions)(TextChat)