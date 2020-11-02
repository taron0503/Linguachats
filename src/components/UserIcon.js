import React, {Component} from "react"
import styled from 'styled-components'


class UserIcon extends Component{
	render(){
    let imgsrc = require("../images/profileImages/avatarDef.png")
	if(this.props.img)
	    imgsrc = require("../images/profileImages/"+this.props.img)
	let size = this.props.size?this.props.size+"px":"50px"	
	let color = this.props.status==="talking"?"red":"limegreen"
	let UserIconWrapper=styled.div`
		display:inline-block;
		position: relative;
		width:fit-content;
		&:before {
			content:"";
			position: absolute;
			right:3px;
			height:${parseInt(size)/6}px;
			width: ${parseInt(size)/6}px;
			display: inline-block;
			border-radius: 50%;
			background:${color};
		}
		`
		return(
			<UserIconWrapper>
				<img style={{width:size,
								height:size,
							borderRadius:"50%"}} alt="User Icon" src = {imgsrc}/>
		    </UserIconWrapper>
		   	
			)
	}
}		
export default UserIcon