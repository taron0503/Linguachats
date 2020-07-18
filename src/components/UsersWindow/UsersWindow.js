import React, {Component} from "react"
import UserItem from "../UserItem"
import "./style.css"
import { connect } from 'react-redux';
import * as actions from '../../actions';


class UsersWindow extends Component{
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

		return (
			<div className="TextChatWindow">

				<div className = "containner-fluid chatWindow_header sticky-top">
				  	<div className="row">
					  	<div className={"col-sm-6 col-6 chatWindow_header_item "+(All_Users?"selected":" ")} 
					  			 onClick={()=>this.handleClick("All_Users")}>All Users</div>
					  	<div className={"col-sm-6 col-6 chatWindow_header_item "+(Chats?"selected":"")}
					  			 onClick={()=>this.handleClick("Chats")}>Chats</div>
					  </div>
				</div>

				<div className="container-fluid TextChatUsers Cscroll">
				  <div className="row usersTable_header sticky-top">
				  </div>

				  {users.map((user,index)=>{
				  	if(this.props.user.partnerId==user.socketid){
				  		return <UserItem user={user} key={index} newPartner={()=>{}} partner={true} styles={{"backgroundColor":"lightblue"}}/>
				  	}
				  	if(this.state.Chats){
				  		if(user.chat)
				  			return <UserItem user={user} key={index} newPartner={this.props.newPartner}/>
				  	}else{
				  		if(user.socketid == this.props.user.socketid){
				  			return <UserItem user={user} key={index} newPartner={()=>{}}/>
				  		}else{
				  			return <UserItem user={user} key={index} newPartner={this.props.newPartner}/>
				  		}
				  	}
				  })}

				</div>
			</div>

			)
	}
} 

const mapStateToProps = (state) => {
  state = state.main_reducer
  return {
    users: state.users,
    user:state.user,
  };
};

export default connect(mapStateToProps,actions)(UsersWindow)