import React, {Component} from "react"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {Dropdown} from 'react-bootstrap';
import {isMobile} from "react-device-detect";
import UserIcon from "../UserIcon";
import styles from "./style.module.css"


class ProfileDropdown extends Component{

 /*CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
	  <div className="user_profile_name"
	    ref={ref}
	    onClick={(e) => {
	      onClick(e);
	    }}
	  >
	    {children}
	  </div>
	));*/

 	handleEdit=()=>{
 		this.props.toggleInitReg(true)
 		this.props.toggleInitRegToEdit(true)
 	}

 	handleLogOut=()=>{
 		localStorage.removeItem("user");
 		window.location.href = '/';
 	}

  render(){
  	let user = this.props.user
	  return(
			<Dropdown className={styles.user_profile}>
			  <Dropdown.Toggle  id="dropdown-basic" as="div" style={{"cursor":"pointer"}}>
			    {isMobile?<UserIcon gender = {user.gender} size="25" img={user.img}/>:user.fullname}
			  </Dropdown.Toggle>

			  <Dropdown.Menu className={styles.dropdown_menu_center}>
			    <Dropdown.Item onClick={this.handleEdit}>Edit</Dropdown.Item>
			    {/*<Dropdown.Item>Register</Dropdown.Item>*/}
			    <Dropdown.Item onClick={this.handleLogOut}>LogOut</Dropdown.Item>
			  </Dropdown.Menu>
			</Dropdown>
			)
  	}	
} 

const mapStateToProps = (state) => {
  state = state.main_reducer
  return {
    showInitReg:state.showInitReg
  };
};

export default connect(mapStateToProps,actions)(ProfileDropdown)