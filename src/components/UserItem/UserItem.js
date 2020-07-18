import React, {Component} from "react"
import UserIcon from "../UserIcon"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {isMobile} from "react-device-detect";
import "./style.css"

class UsersItem extends Component{
	handleUserItemClick = ()=>{
		let newPartner = this.props.newPartner
		newPartner(this.props.user.socketid)
		if(isMobile)
			this.props.toggleUsersWindow(false)
	}
	render(){
		let user = this.props.user
		let gender_class = user.gender==="Male"?"male":"female"
		let unread_messages = user.messages.reduce((count,message)=>{
			return message.unread?count+1:count
		},0)
		return (
	    		<div className="row no-gutter user_row" onClick={this.handleUserItemClick} style={this.props.styles}>
	    		    <div className="col-sm-2 col-2 ">
		    		  <UserIcon gender={user.gender} size="50" img={user.img}/>
	    			</div>
	    		    <div className="col-10 col-sm-5">
				      <div style={{"fontWeight":"600"}}>{/*symbol+" "+*/user.fullname}</div>
				      <span className="user_data_label">Age:</span>
				      <span className="user_data">{user.age}</span>
				      <span className="user_data_label">Country:</span>
				      <span className="user_data">{" "+user.country}</span>
				    </div>
				    <div className="col-sm-5">
				      <div>
				      <span className="user_data_label">Speaks:</span>
				      <span className="user_data">{user.speaks.map(user=>" "+user)}</span>
				      </div>
				      <div>
				      <span className="user_data_label">Learns:</span>
				      <span className="user_data">{user.learns.map(user=>" "+user)}</span>
				      </div>
				       {user.chat && 
				      	<div className="chaticon">
					      	{unread_messages>0 && <div className="newMessageIcon">{unread_messages}</div>}
						    <img src={require("../../images/chaticon2.png")}/>	
					    </div>}
				    </div>
	    		</div>
				)
	}
} 

const mapStateToProps = (state) => {
  state = state.main_reducer
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps,actions)(UsersItem)