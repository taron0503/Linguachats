import React, {Component} from "react"
import UsersWindow from "./UsersWindow"
import MessagesWindow from "./MessagesWindow"
import { connect } from 'react-redux';
import * as actions from '../actions';

import socket from "../services/socket.js"

class TextChat extends Component{

	componentDidMount=()=>{
		socket.on('send_message', this.handleOnMessage);
	}

	handleOnMessage=(msg)=>{
		this.props.addMessage(msg)
	}

	render(){
		let partner = this.props.partner
		return (
			<div className="container-fluid TextChat">
			  <div className="row no-gutter">
			    <div className="col-sm-4">
			      <UsersWindow/>
			    </div>
			    <div className="col-sm-8">
			    {partner?
			      <MessagesWindow partner={partner}/>:<div>Find someone to talk</div>
			    }
			    </div>
			  </div>
			</div>

			)
	}
} 

const mapStateToProps = (state) => {
	state = state.main_reducer
	let partner = state.users.find(user=>user.socketid==state.user.partnerId)
  return {
    partner:partner,
    users:state.users,
  };
};

export default connect(mapStateToProps,actions)(TextChat)