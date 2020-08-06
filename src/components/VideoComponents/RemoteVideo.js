import React, {Component} from "react"
import UserIcon from "../UserIcon"

import videoCall_Icon from "../../images/videoCall_Icon.png"
import hangUp_Icon from "../../images/hangUp_Icon.png"
import "./style.css"

export default class RemoteVideo extends Component{
	constructor(props){
		super(props)
		
	}

	render(){
		console.log(this.props.status)
		let partner = this.props.partner
		let status = this.props.status
		let denied = this.props.denied
		return(
				<div className="remoteVideoWrapper">
				{status==="talking"? 
					<video autoPlay 
				         ref={this.props.remoteVideo} 
				         id="remote-video"
				         className="remoteVideo"></video>:
				  <div className="buttonContainer">
						<UserIcon size="80" img={partner.img}/>
						<div className = "partnerName">{partner.fullname}</div>
						{status==="calling" && <span className="callingStatus">...calling</span>}
						{denied.status && <span>denied</span>}
				    {status==="free" && 
				  	<div className="videoCall_Icon"><img src={videoCall_Icon}  onClick ={this.props.call}/></div>}
					  {status!=="free" && 
					  <div className="hangUp_Icon"><img src={hangUp_Icon}  onClick ={()=>{this.props.endCall(false)}}/></div>}
			    </div>
				}
				</div>
			)
	}
}