import React, {Component} from "react"

import LocalVideo from "./LocalVideo"
import RemoteVideo from "./RemoteVideo"

import "./style.css"

export default class VideoChatModal extends Component{
	constructor(props){
		super(props)
		
	}

	render(){
		let partner = this.props.partner
		let status = this.props.status
		let localVideo=this.props.localVideo 
    let remoteVideo=this.props.remoteVideo 
    let call=this.props.call 
    let endCall=this.props.endCall 
    let videoOff=this.props.videoOff
    let denied=this.props.denied		
		return(
			<div className = "VideoChatModal">
				<div className = "videoContainer">
					<RemoteVideo partner={partner} status={status} remoteVideo={remoteVideo} call={call} endCall={endCall} denied={denied}/>
					<LocalVideo partner={partner} status={status} localVideo={localVideo} endCall={endCall} videoOff={videoOff}/>
				</div>
					
			</div>
			)
	}
}