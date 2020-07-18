import React, {Component} from "react"
/*import female_avatar from "../images/profileImages/avatarF.png"
import male_avatar from "../images/profileImages/avatarM.jpg"*/

class UserIcon extends Component{
	render(){
    let imgsrc
	if(this.props.img)
	    imgsrc = require("../images/profileImages/"+this.props.img)
	/*if(imgsrc)
		imgsrc = this.props.gender==="Male"?male_avatar:female_avatar;*/
	let size = this.props.size?this.props.size+"px":"50px"	
		return(
			<div style = {{display: "inline",
						   width:size,
						   marginLeft: "8px"}}>	
		    	<img style={{width:size,
							height:size,
							borderRadius:"50%"}} src = {imgsrc}/>
		   	</div>
			)
	}
}		
export default UserIcon