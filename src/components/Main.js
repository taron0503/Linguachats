import React, {Component} from "react"
import Header from "./Header"
import InitialRegModal from "./InitialRegModal"
import {
  Switch,
  Route,
  Redirect 
} from "react-router-dom";
import TextChat from './TextChat';
import VideoChat from './VideoChat';
import { withRouter} from "react-router";
// import update from 'immutability-helper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {isMobile} from "react-device-detect";
import UserManager from "./Helpers/UserManager"
import CookeManager from "./Helpers/CookieManager"
import './main.css';

import socket from "../services/socket.js"


class Main extends Component{
	constructor(props){
		super(props)
		document.querySelector(':root').style
		    .setProperty('--vh', window.innerHeight/100 + 'px');
		window.addEventListener('resize', () => { 
		  document.querySelector(':root').style
		    .setProperty('--vh', window.innerHeight/100 + 'px');
		})
		
		let id = CookeManager.getCookie("id")
		if(id){
			this.props.turnLoggedIn(true)
			UserManager.getUser()
			.then(user=>{
				if(user){
					this.addUserToChat(user)
				}else{
					this.props.turnLoggedIn(false)
				}
			})
		}else{
			this.props.turnLoggedIn(false)
		}

		
	}


	componentDidMount=()=>{
		// window.history.pushState(null, null, window.location.pathname);
		// window.onpopstate = function(event) {
		// 	console.log("location: ");
		//   };
    	// window.addEventListener('popstate', console.log("4545454"));

		socket.on('AllOnlineUsers',(users)=>{
			this.props.AllOnlineUsers(users)
		})
		socket.on('addUser', (user)=>{
			this.props.addUser(user)
		});
		socket.on('deleteUser', (user)=>{
			if(this.props.partner && user.socketid === this.props.partner.socketid){
				this.props.newPartner();
			}
			this.props.deleteUser(user)
		});

		socket.on("left_chat", (partner)=>{
			this.props.userLeftChat(partner.socketid)
			this.props.toggleUsersWindow(true)
			this.props.toggleHeader(true)
		})

		socket.on("addUserToVideoChat",(socketid)=>{
			this.props.addUserToVideoChat(socketid)
		})

		socket.on("deleteUserFromVideoChat",socketid=>{
			this.props.deleteUserFromVideoChat(socketid)
		})

		socket.on("changeStatus",({socketid,status})=>{
			this.props.changeUserStatus(socketid,status)
		})

		socket.on('send_message', this.handleOnMessage);

		socket.on("startTyping",(partner)=>{
			this.props.startTyping(partner.socketid)
		})

		socket.on("endTyping",(partner)=>{
			// console.log("endTyping")
			this.props.endTyping(partner.socketid)
			// console.log(partner)
		})


	}

	componentWillUnmount=()=>{
		socket.off('send_message', this.handleOnMessage);
	}

	handleOnMessage=(msg)=>{
		// console.log(msg)
		this.props.addMessage(msg)
		this.props.endTyping(msg.sender)
		this.props.changeUserPosition(msg.sender)
	}

	handleRegisterConfirmation = async (user)=>{
		let saved = await UserManager.saveUser(user)
		if(saved){
			this.props.turnLoggedIn(true)
			user = await UserManager.getUser()
			this.addUserToChat(user)
		}
	}

	handleEditConfirmation=async (user)=>{ 
		// socket.disconnect()
		// socket.connect()
		// const id = user.id
		// console.log(user)
		// console.log(this.props.user)
		const id = this.props.user.id
		const updated = await UserManager.updateUser(id,user)
		if(updated){
			socket.disconnect()
			socket.connect()
			UserManager.getUser(id)
			.then(user=>{
				this.addUserToChat(user)
				this.props.toggleInitRegToEdit(false)
			})
		}
		// this.addUserToChat(user)
		// localStorage.setItem("user",JSON.stringify(user))
		// this.props.toggleInitReg(false)
	}

	addUserToChat=(user)=>{
		socket.emit("get_socketid")
		socket.off("send_socketid")
		socket.on("send_socketid",(socketid)=>{
		  user.socketid = socketid
		  socket.emit("user_data",user)
		})
		this.props.setUser(user) 	
	}

	render(){
		let handleModalConfirmation = this.props.InitReg.edit?this.handleEditConfirmation:this.handleRegisterConfirmation
		return (
			<React.Fragment>
			  <div className="container-fluid TextChat">
				  <div className="row no-gutter">
				    <div className="col-sm-2">
				    	{(!isMobile || (isMobile && this.props.Header.show)) &&
				      	<Header user={this.props.user}/>
				    	}
				    </div>
				    <div className="col-sm-10">
					    <Switch>
				          <Route path="/TextChat" addUserToChat={this.addUserToChat}>
				            <TextChat />
				          </Route>
				          <Route path="/VideoChat">
				            <VideoChat />
				          </Route>
				          <Route path="/">
				            <Redirect to="/TextChat" addUserToChat={this.addUserToChat}/>
				          </Route>  
				      </Switch>
				    </div>
				  </div>
			  </div>
			  
			  <InitialRegModal show = {!this.props.loggedIn}
			  				   edit = {this.props.InitReg.edit} 
			  				   handleModalConfirmation={handleModalConfirmation}
			  				   />
			</React.Fragment>
			)
	}
} 

const mapStateToProps = (state) => {
	let WindowToggle = state.WindowToggle
	//state = state.main_reducer
  return {
  	Header:WindowToggle.Header,
    InitReg:state.main_reducer.InitReg,
	user:state.main_reducer.user,
	loggedIn:state.main_reducer.loggedIn,
	state:state,
    // partner:state.partner,
  };
};

export default withRouter(connect(mapStateToProps,actions)(Main))

