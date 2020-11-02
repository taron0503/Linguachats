import React, {Component} from "react"
import UserIcon from "../UserIcon"

import videoCall_Icon from "../../images/videoCall_Icon.png"
import hangUp_Icon from "../../images/hangUp_Icon.png"
import {isMobile} from "react-device-detect";

import "./style.css"

export default class RemoteVideo extends Component{

	render(){
		let partner = this.props.partner
		let status = this.props.status
		let answer = this.props.answer

		let remoteVideoOffOn = this.props.remoteVideoOffOn
		return(
				<div className={"remoteVideoWrapper " + (isMobile && "remoteVideoWrapperM")}>

				{status==="talking" &&
					<>
					<video autoPlay 
				         ref={this.props.remoteVideo} 
				         id="remote-video"
				         className="remoteVideo"
				         style={{display:remoteVideoOffOn==="Off"?"none":"block"}}></video>

						 <div className="buttonContainer" style={{display:remoteVideoOffOn==="Off"?"flex":"none"}}>
						  <UserIcon size="80" img={partner.img}/>
						  <div className = "partnerName">{partner.fullname}</div>
						</div></>

			  }


				{status!=="talking" &&
				  <div className="buttonContainer">
						<UserIcon size="80" img={partner.img}/>
						<div className = "partnerName">{partner.fullname}</div>
						
						{status==="calling" && 
						  <span className="callingStatus">...calling</span>}
						{answer==="denied" && 
							<span className="call_answer">Denied</span>}
						{answer==="no_answer" && 
							<span className="call_answer">No answer</span>}
				    {status==="free" && 
				  	  <div className="videoCall_Icon"><img src={videoCall_Icon}  onClick ={this.props.call}/></div>}
					  {status!=="free" && 
					    <div className="hangUp_Icon"><img src={hangUp_Icon}  onClick ={()=>{this.props.endCall(false)}}/></div>}
						 
			    </div>}
				

				</div>
			)
	}
}