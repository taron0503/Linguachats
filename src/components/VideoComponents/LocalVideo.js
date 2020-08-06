import React, {Component} from "react"
import UserIcon from "../UserIcon"
import Media from "../../services/Media"
import videoCall_Icon from "../../images/videoCall_Icon.png"
import hangUp_Icon from "../../images/hangUp_Icon.png"
import videoOn_Icon from "../../images/videoOn_Icon.png"
import videoOff_Icon from "../../images/videoOff_Icon.png"
import "./style.css"

export default class LocalVideo extends Component{
	constructor(props){
		super(props)
		
	}

	componentWillUnmount=()=>{
		this.props.endCall()
	}

	render(){
		let partner = this.props.partner
		let status = this.props.status
		return(
					<div className="localVideoWrapper">
					  <video autoPlay
						       ref = {this.props.localVideo} 
						       id = "local-video" 
						       className="localVideo"></video>
						{status!=="talking" && 
							<div className="buttonContainerLV">
							  <div className="hangUp_Icon">
							    <img src={hangUp_Icon}  onClick ={()=>{this.props.endCall(false)}}/>
							  </div>
							  <div className="videoOff_Icon">
							    <img src={videoOn_Icon}  onClick ={()=>{Media.videoOff()}}/>
							  </div>
					    </div>
					  }
					</div>
			)
	}
}