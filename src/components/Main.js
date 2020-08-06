import React, {Component} from "react"
import Header from "./Header"
import InitialRegModal from "./InitialRegModal"
import {
  Switch,
  Route,
  Redirect 
} from "react-router-dom";
import TextChat from './TextChat';
import VoiceChat from './VoiceChat';
// import update from 'immutability-helper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {isMobile} from "react-device-detect";
import './main.css';

import socket from "../services/socket.js"


class Main extends Component{
	constructor(props){
		super(props)
		window.addEventListener('resize', () => { 
		  document.querySelector(':root').style
		    .setProperty('--vh', window.innerHeight/100 + 'px');
		})

		let user = localStorage.getItem("user")
		user = JSON.parse(user)
	    if(user){
	     this.addUserToChat(user)
	    }else{
	    	this.props.toggleInitReg(true)
	    }
	}

	componentDidMount=()=>{
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
		})

		socket.on("addUserToVoiceChat",(socketid)=>{
			this.props.addUserToVoiceChat(socketid)
		})

		socket.on("deleteUserFromVoiceChat",socketid=>{
			this.props.deleteUserFromVoiceChat(socketid)
		})

		socket.on("startTyping",(partner)=>{
			this.props.startTyping(partner.socketid)
		})

		socket.on("endTyping",(partner)=>{
			// console.log("endTyping")
			this.props.endTyping(partner.socketid)
			// console.log(partner)
		})


	}

	handleRegisterConfirmation=(user)=>{
		this.addUserToChat(user)
		localStorage.setItem("user",JSON.stringify(user))
		this.props.toggleInitReg(false)
	}

	handleEditConfirmation=(user)=>{ 
		socket.disconnect()
		socket.connect()
		this.addUserToChat(user)
		localStorage.setItem("user",JSON.stringify(user))
		this.props.toggleInitReg(false)
	}

	addUserToChat=(user)=>{
			let that = this
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
				          <Route path="/TextChat">
				            <TextChat />
				          </Route>
				          <Route path="/VoiceChat">
				            <VoiceChat />
				          </Route>
				          <Route path="/">
				            <Redirect to="/TextChat" />
				          </Route>  
				      </Switch>
				    </div>
				  </div>
			  </div>
			  
			  
			  <InitialRegModal show = {this.props.InitReg.show}
			  				   edit = {this.props.InitReg.edit} 
			  				   handleModalConfirmation={handleModalConfirmation}
			  				   />
			</React.Fragment>
			)
	}
} 

const mapStateToProps = (state) => {
	let WindowToggle = state.WindowToggle
	state = state.main_reducer
  return {
  	Header:WindowToggle.Header,
    InitReg:state.InitReg,
    user:state.user,
    // partner:state.partner,
  };
};

export default connect(mapStateToProps,actions)(Main)

