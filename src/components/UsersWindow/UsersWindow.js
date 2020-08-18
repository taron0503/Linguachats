import React, {Component} from "react"
import UserItem from "../UserItem"
import UsersSortDropdown from "../UsersSortDropdown"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {isMobile} from "react-device-detect";
import "./style.css"

export default class UsersWindow extends Component{
	constructor(props){
		super(props)
		this.state = {All_Users:true,Chats:false}
	}

	handleClick=(value)=>{
		if(value==="All_Users"){
			this.setState({All_Users:true,Chats:false})
		}else{
			this.setState({All_Users:false,Chats:true})
		}
	}

	render(){
		let {All_Users, Chats} = this.state
		let users = this.props.users
		let TextChatUsersHeight = isMobile?"calc(100 * var(--vh,1vh) - 37.6px - 57.15px)":"calc(100% - 36.375px)"

		return (
			<div className="TextChatWindow">

				<div className = "containner-fluid chatWindow_header sticky-top">
				  	<div className="row">
					  	<div className={"col-sm-3 col-3 chatWindow_header_item "+(All_Users?"selected":" ")} 
					  			 onClick={()=>this.handleClick("All_Users")}>All Users
					  	</div>
					  	<div className={"col-sm-2 col-2 chatWindow_header_item "+(Chats?"selected":"")}
					  			 onClick={()=>this.handleClick("Chats")}>Chats
					  	</div>
					  	<div className = "col-sm-7 col-7 UsDropdownContainer">
								<UsersSortDropdown/>
						  </div>
					  </div>
				</div>

				<div className="container-fluid TextChatUsers Cscroll" style = {{height:TextChatUsersHeight}}>

				  {users.map((user,index)=>{
				  	if(this.state.Chats){
				  		if(user.chat)
				  			return <UserItem user={user} main_user={this.props.main_user} key={index}  handleUserItemClick={this.props.handleUserItemClick}/>
				  	}else{
				  			return <UserItem user={user} main_user={this.props.main_user} key={index}  handleUserItemClick={this.props.handleUserItemClick}/>
				  	}
				  	return ""
				  })}

				</div>
			</div>

			)
	}
} 

