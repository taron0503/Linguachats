import React, {Component} from "react"
import {Nav, Navbar} from 'react-bootstrap';
import ProfileDropdown from "../ProfileDropdown"
import {Link} from "react-router-dom";
import UserIcon from "../UserIcon";
import ChatIcon from '../ChatIcon';
import "./style.css"


export default class Header extends Component{  
	render(){
		let user = this.props.user
		return (

			<div>
					<Navbar className="d-flex d-sm-none pt-0 pb-0" bg="dark" variant="dark">
				    <Navbar.Brand as={Link} to="/">LinguaChats</Navbar.Brand>
				    <Nav className="mr-auto" activeKey="/VoiceChat">
				      <Link to="/TextChat" className="nav-link">
				      	<div className="navLinkItem">
				      	  <ChatIcon imgsrc={"chat_Icon.png"} size={"20"}/>
				      	  TextChat
				      	</div>
				      </Link>
				      <Link to="/VoiceChat" className="nav-link">
				      	<div className="navLinkItem">
				      		<ChatIcon imgsrc={"videoCall_Icon3.png"} size={"20"}/>
				      		VideoChat
				      	</div>		
				      </Link>
				    </Nav>
				    <Nav className="ml-auto">
				    	{<ProfileDropdown user={user}/>}
				    </Nav>
				  </Navbar>
       
       <Navbar className="flex-column navbar full_height d-none d-sm-flex mr-0" bg="dark" variant="dark">
			    <div className = "NavBarHeader">
				    <Navbar.Brand className="mr-0" as={Link} to="/">LinguaChats</Navbar.Brand>
				    <Nav activeKey="/VoiceChat">
				      <Link to="/TextChat" className="nav-link">
				      	<div className="navLinkItem">
				      	  <ChatIcon imgsrc={"chat_Icon.png"} size={"20"}/>
				      	  TextChat
				      	</div>
				      </Link>
				      <Link to="/VoiceChat" className="nav-link">
				      	<div className="navLinkItem">
				      		<ChatIcon imgsrc={"videoCall_Icon3.png"} size={"20"}/>
				      		VideoChat
				      	</div>		
				      </Link>
				    </Nav>
			    </div>
			    	<UserIcon gender={user.gender} size="65" img={user.img}/>
			    <Nav>
			    	{<ProfileDropdown user={user}/>}
			    </Nav>
		  </Navbar>
		</div>
			)
	}
} 
