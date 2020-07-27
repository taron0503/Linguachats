import React, {Component} from "react"
import UserIcon from "../UserIcon"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import TypingIcon from '../Helpers/TypingIcon';

import {isMobile} from "react-device-detect";
import "./style.css"

class UsersItem extends Component{
	handleUserItemClick = ()=>{
		let newPartner = this.props.newPartner
		newPartner(this.props.user.socketid)
		if(isMobile){
			this.props.toggleMessagesWindow(true)
			this.props.toggleUsersWindow(false)
			this.props.toggleHeader(false)
		}
	}
	render(){
		let user = this.props.user
		let unread_messages = user.messages.reduce((count,message)=>{
			return message.unread?count+1:count
		},0)
		return (
	    		<div className="row no-gutter user_row" onClick={this.props.main_user.socketid!==user.socketid?this.handleUserItemClick:()=>{}} style={this.props.styles}>
	    		    <div className="col-sm-2 col-2 ">
		    		  <UserIcon size="50" img={user.img}/>
	    			</div>
	    		    <div className="col-10 col-sm-6">
				      <div style={{"fontWeight":"600"}}>{/*symbol+" "+*/user.fullname+" "}
				      {user.typing && <TypingIcon size={3}/>}</div>
				      <span className="user_data_label">Age:</span>
				      <span className="user_data">{user.age}</span>
				      <span className="user_data_label">Country:</span>
				      <span className="user_data">{" "+user.country}</span>
				    </div>
				    <div className="col-sm-4">
				      <div>
					      <span className="user_data_label">Speaks:</span>
					      <span className="user_data" style={user.speaks.length>2?{fontSize:"11px"}:{}}>
					       {user.speaks.map((language,index)=>{
					       	if(index===0) 
					       		return language
					       	return ", "+language
					       	})
					       }
					      </span>
				      </div>
				      <div>
					      <span className="user_data_label">Learns:</span>
					      <span className="user_data" style={user.learns.length>2?{fontSize:"11px"}:{}}>
					      {user.learns.map(language=>" "+language)}</span>
				      </div>
				    </div>
				    {user.chat && 
				      	<div className="chaticon">
					      	{unread_messages>0 && <div className="newMessageIcon">{unread_messages}</div>}
						    <img alt="ChatIcon" src={require("../../images/chaticon2.png")}/>	
					    </div>}
	    		</div>
				)
	}
} 

const mapStateToProps = (state) => {
  state = state.main_reducer
  return {
  	main_user:state.user,
    users: state.users,
  };
};

export default connect(mapStateToProps,actions)(UsersItem)