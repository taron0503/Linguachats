import React, {Component} from "react"
import {Nav, Navbar} from 'react-bootstrap';
import ProfileDropdown from "../ProfileDropdown"
import {Link} from "react-router-dom";
import UserIcon from "../UserIcon";
import "./style.css"


export default class Header extends Component{  
	render(){
		let user = this.props.user
		// console.log(user)
		return (

			<div>
				<Navbar className="d-flex d-sm-none" bg="dark" variant="dark">
			    <Navbar.Brand as={Link} to="/">LinguaChats</Navbar.Brand>
			    <Nav className="mr-auto" activeKey="/VoiceChat">
			      <Link to="/TextChat" className="nav-link">TextChat</Link>
			      <Link to="/VoiceChat" className="nav-link">VoiceChat</Link>
			    </Nav>
			    <Nav className="ml-auto">
			    	{<ProfileDropdown user={user}/>}
			    </Nav>
			  </Navbar>
          
        
       <Navbar className="flex-column navbar full_height d-none d-sm-flex" bg="dark" variant="dark">
			    <div className = "NavBarHeader">
				    <Navbar.Brand as={Link} to="/">LinguaChats</Navbar.Brand>
				    <Nav activeKey="/VoiceChat">
				      <Link to="/TextChat" className="nav-link">TextChat</Link>
				      <Link to="/VoiceChat" className="nav-link">VoiceChat</Link>
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
