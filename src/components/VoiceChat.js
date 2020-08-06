import React, {Component} from "react"
import UsersWindow from "./UsersWindow"
import MessagesWindow from "./MessagesWindow"
import {VideoChatModal} from "./VideoComponents"
import {isMobile} from "react-device-detect";
import CallingModal from "./CallingModal"
import Media from "../services/Media"

import { connect } from 'react-redux';
import * as actions from '../actions';

import socket from "../services/socket.js"

const {RTCPeerConnection, RTCSessionDescription} = window


class VoiceChat extends Component{
	constructor(props){
		super(props)
		this.localVideo = React.createRef();
		this.remoteVideo = React.createRef();
		this.icecandidates=[]
		this.state = {caller:"",
									denied:{
										status:false,
										time:"",
									}}
	}

	componentDidMount=async()=>{
		let user = this.props.user
		socket.emit("addUserToVoiceChat",user.socketid)
		socket.on("send_socketid",(socketid)=>{
        if(socketid===user.socketid){
        	socket.emit("addUserToVoiceChat",user.socketid)
        }
    })

    socket.on('deleteUser', (user)=>{
    	console.log("deleteusercall")
			this.props.changeStatus(this.props.user.socketid,"free")
		});

		socket.on('left_chat', (user)=>{
			this.props.changeStatus(this.props.user.socketid,"free")
		});

    socket.on('icecandidate',async (icecandidate)=>{
    	this.icecandidates.push(icecandidate)
    })  

    socket.on("call-made", async data => {
    	this.offer_data=data
    	let caller = this.props.users.find(user=>user.socketid===data.socket)
    	if (caller){
    		this.setState({caller:caller})
    		this.props.changeStatus(this.props.user.socketid,"reciving_call")
    	  // this.props.toggleCallingModal(true)
    	}
		});

		socket.on("answer-made", async data => {
			console.log("answer-made")
			if(data.status==="reject"){
				this.props.changeStatus(this.props.user.socketid,"free")
				this.setState({denied:{...this.state.denied,status:true}})
    		console.log("rejected")
			}else{
			 this.props.changeStatus(this.props.user.socketid,"talking")
	     await this.peerConnection.setRemoteDescription(
	     new RTCSessionDescription(data.answer));
	   }
	   
    });

		socket.on("endCall",()=>{
			if(this.props.user.status==="reciving_call"){
				this.props.changeStatus(this.props.user.socketid,"free")
				// this.props.toggleCallingModal(false)
				this.offer_data=""
			}
			if(this.state.status==="talking"){
				this.closeChat()
			}
		})
		
	}

	componentWillUnmount=()=>{
		socket.emit("deleteUserFromVoiceChat",this.props.user.socketid)
		if(this.props.partner)
			socket.emit("endCall",this.props.partner.socketid)
		this.closeChat()
    this.props.meLeftChat(this.props.user.partnerId);
    socket.off("icecandidate")
    socket.off("call-made")
    socket.off("answer-made")
    socket.off("endCall")
	}

	handleUserItemClick=async (user)=>{
		let newPartner = this.props.newPartner
		newPartner(user.socketid)
		if(isMobile){
			this.props.toggleMessagesWindow(true)
			this.props.toggleUsersWindow(false)
			this.props.toggleHeader(false)
		}
		await this.showMe()
	}

	createPeerConnection=()=>{
		this.peerConnection = new RTCPeerConnection()
		this.peerConnection.ontrack = ({ streams: [stream] })=> {
	  const remoteVideo = this.remoteVideo.current;
		 if (remoteVideo) {
		   remoteVideo.srcObject = stream;
		 }
    };
    this.peerConnection.onicecandidate = (event) => {
		  	console.log("icecandidate")
		  	// console.log(event)
			  if (event.candidate) {
			    socket.emit("icecandidate",{candidate:event.candidate,to:this.props.partner.socketid})
			  } else {
			    /* there are no more candidates coming during this negotiation */
			  }
		}
	}

	sendAnswer=async()=>{
		this.createPeerConnection();
		await this.showMe()
		this.stream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.stream));
		let data = this.offer_data  	
	  await this.peerConnection.setRemoteDescription(
	   new RTCSessionDescription(data.offer)
	  );
	  this.icecandidates.forEach(icecandidate=>{this.peerConnection.addIceCandidate(icecandidate)})
		
		const answer = await this.peerConnection.createAnswer();
		await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
		 
		 socket.emit("make-answer", {
		   answer,
		   to: data.socket
		 });

	}

	showMe=async()=>{
			// const stream = await this.startMedia()
			// this.stream = stream
			// const localVideo = this.localVideo.current;
			// 		   if (localVideo) {
			// 		   	 localVideo.muted=true;
			// 		     localVideo.srcObject = stream;
			// 		   }
			await Media.start()
			const localVideo = this.localVideo.current;
					   if (localVideo) {
					   	 localVideo.muted=true;
					     localVideo.srcObject = Media.stream;
					   }
	}

	callUser=async()=>{
		console.log("call_user")
		this.createPeerConnection();
		Media.stream.getTracks().forEach(track => this.peerConnection.addTrack(track, Media.stream));
	  const offer = await this.peerConnection.createOffer();
	  await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
	  socket.emit("call-user", {
	    offer,
	    to: this.props.partner.socketid
	  });
	  this.props.changeStatus(this.props.user.socketid,"calling")
	}

	startMedia=async()=>{
		const stream = await navigator.mediaDevices.getUserMedia( { video: true, audio: true })
		return stream
	}

	endMedia=async(stream)=>{
		let tracks = stream.getTracks()
	  tracks.forEach((track)=>{
      track.stop();
	  });
	}

	videoOff=async(stream)=>{
		Media.videoOff();
		// let tracks = stream.getTracks()
		// console.log(tracks)
		// tracks.find(track=>track.kind==="video").stop()
	}

	closeChat=(endMedia=true)=>{
		console.log("closeChat")
		if(this.stream && endMedia){
			this.endMedia(this.stream)
		}
		if(this.peerConnection){
			this.peerConnection.close()
			this.peerConnection=null;
		}
		this.props.changeStatus(this.props.user.socketid,"free")
	}

	endCall=(endMedia=true)=>{
		if(this.props.partner)
		socket.emit("endCall",this.props.partner.socketid)
		this.closeChat(endMedia)
	}


	render(){
		let partner = this.props.partner
		return (
			<React.Fragment>
			{this.state.caller && <CallingModal caller={this.state.caller} changeStatus={this.changeStatus} sendAnswer={this.sendAnswer}/>}
			<div>
				<div className="container-fluid TextChat">
				  <div className="row no-gutter">
				    <div className="col-sm-4">
				    <UsersWindow users={this.props.users} 
				    						 main_user={this.props.user}
				    						 handleUserItemClick={this.handleUserItemClick}/>
				    </div>
				    <div className="col-sm-8">
				    		{partner && 
				    			 <MessagesWindow partner={partner}>
						    	   <VideoChatModal partner={partner}
						    	                   localVideo={this.localVideo} 
						    	                   remoteVideo={this.remoteVideo} 
						    	                   call={this.callUser} 
						    	                   endCall={this.endCall} 
						    	                   videoOff={()=>{this.videoOff(this.stream)}}
						    	                   status={this.props.user.status}
						    	                   denied={this.state.denied}/>			    	   	
						   		</MessagesWindow>
						    }
						    {!partner &&
						      <div className="EmptyMessageWindow">Find someone to talk</div>
						    }
				    
				    </div>
				  </div>
				</div>	
			</div>
			</React.Fragment>
			)
	}
} 

const mapStateToProps = (state) => {
	let WindowToggle = state.WindowToggle
	state = state.main_reducer
	let partner = state.users.find(user=>user.socketid===state.user.partnerId)
	let users = state.users.filter(user=>user.rooms.includes("voiceChat"))
  return {
  	UsersWindow:WindowToggle.UsersWindow,
  	MessagesWindow:WindowToggle.MessagesWindow,
    partner:partner,
    users:users,
    user:state.user,
    UserIsOnline:state.UserIsOnline,
  };
};

export default connect(mapStateToProps,actions)(VoiceChat)