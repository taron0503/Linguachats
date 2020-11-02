import React, {Component} from "react"

import LocalVideo from "./LocalVideo"
import RemoteVideo from "./RemoteVideo"
import {isMobile} from "react-device-detect";

import "./style.css"

export default class VideoChatModal extends Component{

	render(){
		let partner = this.props.partner
		let status = this.props.status
		let localVideo=this.props.localVideo 
    let remoteVideo=this.props.remoteVideo 
    let call=this.props.call 
    let endCall=this.props.endCall 
    let videoOff=this.props.videoOff
    let videoOn=this.props.videoOn
    let videoOffOn=this.props.videoOffOn
    let audioOff=this.props.audioOff
    let audioOn=this.props.audioOn
    let audioOffOn=this.props.audioOffOn
    let remoteVideoOffOn=this.props.remoteVideoOffOn
    let answer=this.props.answer		
		return(
			<div className = {"videoChatModal " + (isMobile && "videoChatModalM")}>
				<div className = {"videoContainer " + (isMobile && "videoContainerM")}>
					<RemoteVideo 
					   partner={partner} 
					   status={status} 
					   remoteVideo={remoteVideo} 
					   call={call} 
					   endCall={endCall} 
					   answer={answer} 
					   remoteVideoOffOn={remoteVideoOffOn}/>
					<LocalVideo 
					   partner={partner} 
					   status={status} 
					   localVideo={localVideo} 
					   endCall={endCall} 
					   videoOff={videoOff} 
					   videoOn={videoOn} 
					   videoOffOn={videoOffOn}
					   audioOn={audioOn}
					   audioOff={audioOff}
					   audioOffOn={audioOffOn}/>
				</div>
					
			</div>
			)
	}
}