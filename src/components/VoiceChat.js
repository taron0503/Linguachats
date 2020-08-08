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
		              videoOffOn:"On",
		              remoteVideoOffOn:"On",
		              audioOffOn:"On",
									answer:""}
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
				this.setState({answer:"denied"})
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
			if(this.props.user.status==="talking"){
				this.closeChat(false)
			}
		})

		socket.on("videoOffOn",(video)=>{
			this.setState({"remoteVideoOffOn":video})
		})

		socket.on("no_answer",()=>{
			this.setState({answer:"no_answer"})
			this.props.changeStatus(this.props.user.socketid,"free")
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
    socket.off("videoOffOn")
    socket.off("no_answer")
	}

	handleUserItemClick=async (user)=>{
		this.endCall(false);
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
			console.log('got track', stream);
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
		Media.stream.getTracks().forEach(track => this.peerConnection.addTrack(track, Media.stream));
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
			await Media.start()
			const localVideo = this.localVideo.current;
					   if (localVideo) {
					   	 localVideo.muted=true;
					     localVideo.srcObject = Media.stream;
					   }
	}

	callUser=async()=>{
		this.createPeerConnection();
		Media.stream.getTracks().forEach(track => this.peerConnection.addTrack(track, Media.stream));
	  const offer = await this.peerConnection.createOffer();
	  await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
	  socket.emit("call-user", {
	    offer,
	    to: this.props.partner.socketid
	  });
	  this.setState({answer:""})
	  this.props.changeStatus(this.props.user.socketid,"calling")
	}

	
	videoOff=async(stream)=>{
		Media.videoOff();
		this.setState({videoOffOn:"Off"})
		if(this.props.user.status==="talking")
		  socket.emit("videoOffOn",{to:this.props.user.partnerId,OffOn:"Off"})
	}

	videoOn=async(stream)=>{
		await Media.videoOn();
		const localVideo = this.localVideo.current;
					   if (localVideo) {
					   	 localVideo.muted=true;
					     localVideo.srcObject = Media.stream;
					   }
		this.setState({videoOffOn:"On"})

		if(this.props.user.status==="talking"){

			let sender = this.peerConnection.getSenders().find(function(s) {
	        return s.track.kind === "video";
	      });
			sender.replaceTrack(Media.stream.getVideoTracks()[0]);
			// this.peerConnection.addTrack(Media.stream.getVideoTracks()[0])
		  socket.emit("videoOffOn",{to:this.props.user.partnerId,OffOn:"On"})
		}

	}

	audioOff=async(stream)=>{
		Media.audioOff();
		this.setState({audioOffOn:"Off"})
	}

	audioOn=async(stream)=>{
		await Media.audioOn();
		const localVideo = this.localVideo.current;
					   if (localVideo) {
					   	 localVideo.muted=true;
					     localVideo.srcObject = Media.stream;
					   }
		this.setState({audioOffOn:"On"})

		if(this.props.user.status==="talking"){
			let sender = this.peerConnection.getSenders().find(function(s) {
	        return s.track.kind === "audio";
	      });
			sender.replaceTrack(Media.stream.getAudioTracks()[0]);
		}

	}

	closeChat=(endMedia=true)=>{
		console.log("closeChat")
		if(Media.stream && endMedia){
			Media.end()
		}
		if(this.peerConnection){
			this.peerConnection.close()
			this.peerConnection=null;
		}
		this.setState({answer:""})
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
						    	                   videoOff={this.videoOff}
						    	                   videoOn={this.videoOn}
						    	                   videoOffOn={this.state.videoOffOn}
						    	                   remoteVideoOffOn={this.state.remoteVideoOffOn}
						    	                   audioOn={this.audioOn}
						    	                   audioOff={this.audioOff}
						    	                   audioOffOn={this.state.audioOffOn}
						    	                   status={this.props.user.status}
						    	                   answer={this.state.answer}/>			    	   	
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