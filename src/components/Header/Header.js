import React, {Component} from "react"
import {Nav, Navbar} from 'react-bootstrap';
import ProfileDropdown from "../ProfileDropdown"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect 
} from "react-router-dom";
import TextChat from '../TextChat';
import VoiceChat from '../VoiceChat';
import "./style.css"


export default class Header extends Component{  
	render(){
		let user = this.props.user
		return (

			<div>
				<Navbar bg="dark" variant="dark">
			    <Navbar.Brand as={Link} to="/">LinguaChats</Navbar.Brand>
			    <Nav className="mr-auto" activeKey="/VoiceChat">
			      <Link to="/TextChat" className="nav-link">TextChat</Link>
			      <Link to="/VoiceChat" className="nav-link">VoiceChat</Link>
			    </Nav>
			    <Nav className="ml-auto">
			    	{<ProfileDropdown user={user}/>}
			    </Nav>
			  </Navbar>

			  <Switch>
          <Route path="/TextChat">
            <TextChat />
          </Route>
          <Route path="/VoiceChat">
            <VoiceChat />
          </Route>
          <Route path="/">
            <Redirect to="/TextChat" />
          </Route>
          
        </Switch>
			
			</div>
			)
	}
} 
