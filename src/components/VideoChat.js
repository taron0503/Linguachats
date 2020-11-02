import React, {Component} from "react"
import UsersWindow from "./UsersWindow"
import MessagesWindow from "./MessagesWindow"
import {VideoChatModal} from "./VideoComponents"
import {isMobile} from "react-device-detect";
import CallingModal from "./CallingModal"
import Media from "../services/Media"
import { withRouter} from "react-router";

import { connect } from 'react-redux';
import * as actions from '../actions';

import socket from "../services/socket.js"

const {RTCPeerConnection, RTCSessionDescription} = window


class VideoChat extends Component{
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
		if(user.socketid){
			this.handleaddUserToVideoChat(user)
		}else{
			socket.on('addUser', (user_to_add)=>{
				//todo: create multiple methods
				if(user_to_add.socketid===this.props.user.socketid)
				  this.handleaddUserToVideoChat(user_to_add)
			})
		}
		
	// 	socket.on("send_socketid",(socketid)=>{
    //     if(socketid===user.socketid){
    //     	socket.emit("addUserToVoiceChat",user.socketid)
    //     }
	// })
	
	

    socket.on('deleteUser', (user)=>{
			this.props.changeStatus(this.props.user.socketid,"free")
		});

		socket.on('left_chat', (user)=>{
			this.props.changeStatus(this.props.user.socketid,"free")
		});

    socket.on('icecandidate',async (icecandidate)=>{
    	if(this.RemoteDescriptionSetted){
    		// console.log("getIcecandidatePeer",this.props.user.name)
    		this.peerConnection.addIceCandidate(icecandidate)
    	// 	console.log(icecandidate)
    	}else{
    		this.icecandidates.push(icecandidate)
    	}
    })  

    socket.on("call-made", async data => {
    	await this.createPeerConnection();
    	this.offer_data=data
    	let caller = this.props.users.find(user=>user.socketid===data.socket)
    	if (caller){
    		this.setState({caller:caller})
    		this.props.changeStatus(this.props.user.socketid,"reciving_call")
    	  // this.props.toggleCallingModal(true)
    	}
		});

		socket.on("answer-made", async data => {
			if(data.status==="reject"){
				this.props.changeStatus(this.props.user.socketid,"free")
				this.setState({answer:"denied"})
    			//console.log("rejected")
			}else if(data.status==="talking"){
				this.props.changeStatus(this.props.user.socketid,"free")
				this.setState({answer:"busy"})
			}else{
			 this.props.changeStatus(this.props.user.socketid,"talking")
	     await this.peerConnection.setRemoteDescription(
	     new RTCSessionDescription(data.answer));
	     	this.icecandidates.forEach(icecandidate=>{this.peerConnection.addIceCandidate(icecandidate)})
	   }
	   this.RemoteDescriptionSetted=true
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
		socket.emit("deleteUserFromVideoChat",this.props.user.socketid)
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
		socket.off(this.handleaddUserToVideoChat)
	}

	handleaddUserToVideoChat=(user_to_add)=>{
		socket.emit("addUserToVideoChat",user_to_add.socketid)
	}

	handleUserItemClick=async (user)=>{
		if(!(this.props.location.pathname==="/VideoChat/partner")){
			this.props.history.push("/VideoChat/partner")
		}
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
// 		let webex_config = {
//     iceServers: [
//       {urls: 'stun:stun.l.google.com:19302'},
//       {
//         url: 'turn:numb.viagenie.ca',
//         credential: 'muazkh',
//         username: 'webrtc@live.com',
//       },
//     ],
//   }

		let webex_config = { iceServers: [
			{urls: 'stun:stun.l.google.com:19302'},
			{
				url: 'turn:89.223.127.78:3478',
				credential: '0000',
				username: 'taron'
				},
		]}

		this.peerConnection = new RTCPeerConnection(webex_config)
		this.peerConnection.ontrack = ({ streams: [stream] })=> {
			// console.log('got track', stream);
	  const remoteVideo = this.remoteVideo.current;
		 if (remoteVideo) {
		   remoteVideo.srcObject = stream;
		 }
    };
    this.peerConnection.onicecandidate = (event) => {
		  	// console.log("onicecandidate+",this.props.user.name)
		  	// console.log(event.candidate)
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
	  this.RemoteDescriptionSetted=true
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
		let onBack = "closeChat"
		return (
			<React.Fragment>
			{this.state.caller && <CallingModal caller={this.state.caller} changeStatus={this.changeStatus} sendAnswer={this.sendAnswer}/>}
			<div>
				<div className="container-fluid TextChat">
				  <div className="row no-gutter">
				    <div className="col-sm-4">
					{((!partner && isMobile) || !isMobile) &&
				    <UsersWindow users={this.props.users} 
				    			 main_user={this.props.user}
				    			 handleUserItemClick={this.handleUserItemClick}/>}
				    </div>
				    <div className="col-sm-8">
				    		{partner && 
				    			 <MessagesWindow partner={partner}  hideBackArrow={true} onBack={onBack}>
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
	let users = state.users.filter(user=>user.rooms.includes("videoChat"))
  return {
  	UsersWindow:WindowToggle.UsersWindow,
  	MessagesWindow:WindowToggle.MessagesWindow,
    partner:partner,
    users:users,
    user:state.user,
    UserIsOnline:state.UserIsOnline,
  };
};

export default withRouter(connect(mapStateToProps,actions)(VideoChat))