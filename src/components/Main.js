import React, {Component} from "react"
import Header from "./Header"
import InitialRegModal from "./InitialRegModal"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect 
} from "react-router-dom";
import TextChat from './TextChat';
import VoiceChat from './VoiceChat';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import * as actions from '../actions';
import './main.css';

import socket from "../services/socket.js"



class Main extends Component{
	constructor(props){
		super(props)

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
			if(this.props.partner && user.socketid == this.props.partner.socketid){
				this.props.newPartner();
			}
			this.props.deleteUser(user)
		});

		socket.on("left_chat", (partner)=>{
			this.props.leftChat(partner.socketid)
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
		// console.log(this.props)
		return (
			<React.Fragment>
			  <div className="container-fluid TextChat">
				  <div className="row no-gutter">
				    <div className="col-sm-2">
				      <Header user={this.props.user}/>
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
	state = state.main_reducer
  return {
    InitReg:state.InitReg,
    user:state.user,
    // partner:state.partner,
  };
};

export default connect(mapStateToProps,actions)(Main)

