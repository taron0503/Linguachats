import React, {Component} from "react"


class UserIcon extends Component{
	render(){
    let imgsrc = require("../images/profileImages/avatarDef.png")
	if(this.props.img)
	    imgsrc = require("../images/profileImages/"+this.props.img)
	
	let size = this.props.size?this.props.size+"px":"50px"	
		return(
			<img style={{width:size,
							height:size,
						borderRadius:"50%"}} alt="User Icon" src = {imgsrc}/>
		    	
		   	
			)
	}
}		
export default UserIcon