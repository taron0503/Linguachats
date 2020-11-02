import React, {Component} from "react"

import hangUp_Icon from "../../images/hangUp_Icon.png"
import videoOn_Icon from "../../images/videoOn_Icon.png"
import videoOff_Icon from "../../images/videoOff_Icon.png"
import audioOn_Icon from "../../images/audioOn_Icon.png"
import audioOff_Icon from "../../images/audioOff_Icon.png"
import {isMobile} from "react-device-detect";
import "./style.css"

export default class LocalVideo extends Component{

	componentWillUnmount=()=>{
		this.props.endCall()
	}

	render(){
		let status = this.props.status
		let videoOffOn = this.props.videoOffOn
		let audioOffOn = this.props.audioOffOn
		return(
					<div className={"localVideoWrapper "+(isMobile && "localVideoWrapperM")}>
					  <video autoPlay
						       ref = {this.props.localVideo} 
						       id = "local-video" 
						       className="localVideo"></video>
						 
							{status==="talking" &&<div className={"buttonContainerLV "+(isMobile && "buttonContainerLVM")}>
								{audioOffOn==="Off"?
									<div className="LV_Icon">
									    <img src={audioOff_Icon}  onClick ={()=>{this.props.audioOn()}} alt="audioOff"/>
									</div>:
									<div className="LV_Icon">
									    <img src={audioOn_Icon}  onClick ={()=>{this.props.audioOff()}} alt="audioOn"/>
									</div>
								}
							  <div className="hangUp_Icon">
							    <img src={hangUp_Icon}  onClick ={()=>{this.props.endCall(false)}} alt="hangUp"/>
							  </div>
							  {videoOffOn==="Off"?
							  	<div className="LV_Icon">
								    <img src={videoOff_Icon}  onClick ={()=>{this.props.videoOn()}} alt="videoOff"/>
								  </div>:
								  <div className="LV_Icon">
							    	<img src={videoOn_Icon}  onClick ={()=>{this.props.videoOff()}} alt="videoOn"/>
							  	</div>							  	
							  }
					    </div>
					  }
					  
					</div>
			)
	}
}