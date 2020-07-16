import React, {Component} from "react"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {Dropdown} from 'react-bootstrap';
import styles from "./style.module.css"


class ProfileDropdown extends Component{

 CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
	  <div className="user_profile_name"
	    ref={ref}
	    onClick={(e) => {
	      onClick(e);
	    }}
	  >
	    {children}
	  </div>
	));

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
			    {user?user.fullname:""}
			  </Dropdown.Toggle>

			  <Dropdown.Menu className="dropdown-menu-right">
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
    user: state.user,
    showInitReg:state.showInitReg
  };
};

export default connect(mapStateToProps,actions)(ProfileDropdown)