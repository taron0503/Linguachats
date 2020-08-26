import React, {Component} from "react"
import UsersWindow from "./UsersWindow"
import MessagesWindow from "./MessagesWindow"

import { withRouter} from "react-router";
import {isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import * as actions from '../actions';

import socket from "../services/socket.js"

class TextChat extends Component{

	componentWillUnmount=()=>{
      this.props.deletePartner()
	}
	

	handleUserItemClick = (user)=>{
		let newPartner = this.props.newPartner
		newPartner(user.socketid)
		if(isMobile){
			this.props.toggleMessagesWindow(true)
			this.props.toggleUsersWindow(false)
			this.props.toggleHeader(false)
		}

		if(!(this.props.location.pathname==="/TextChat/partner")){
			 this.props.history.push("/TextChat/partner")
		}
		 
	}

	render(){
		let partner = this.props.partner
		let onBack = "collapseChat"
		return (
			<div className="container-fluid TextChat">
			  <div className="row no-gutter">
			    <div className="col-sm-4">
			    {this.props.UsersWindow.show && 
			    	<UsersWindow users={this.props.users} 
			    							 main_user={this.props.user}
			    							 handleUserItemClick={this.handleUserItemClick}/>}
			    </div>
			    <div className="col-sm-8">
			    {(isMobile && this.props.MessagesWindow.show && partner) &&
			    	<MessagesWindow partner={partner} onBack={onBack}/>
			    }
			    {(!isMobile && partner) &&
			      <MessagesWindow partner={partner} onBack={onBack}/>
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
    user:state.user
  };
};

export default withRouter(connect(mapStateToProps,actions)(TextChat))