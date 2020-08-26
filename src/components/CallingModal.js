import React, {Component} from "react"
import { connect } from 'react-redux';
import * as actions from '../actions';

import {Modal,Button,InputGroup,FormControl,FormGroup} from 'react-bootstrap';
import socket from "../services/socket.js"



class CallingModal extends Component{
	
	acceptCall = ()=>{
		this.props.newPartner(this.props.caller.socketid)
		this.props.changeStatus(this.props.user.socketid,"talking")
		this.props.toggleHeader(false)
		this.props.sendAnswer()
    //await this.showMe()
		//socket.emit("make-answer-signal",{to:this.props.caller.socketid,accept:true})
	}

	rejectCall=()=>{
		socket.emit("make-answer",{to:this.props.caller.socketid,status:"reject"})
		this.props.changeStatus(this.props.user.socketid,"free")
		//this.props.toggleCallingModal(false)
	}

	render(){
		let user=this.props.user
		return(
				// <Modal show={this.props.CallingModal.show} onHide={this.handleClose}>
				<Modal show={this.props.user.status==="reciving_call"} onHide={this.handleClose}>
				    <Modal.Body>
					    <p>{this.props.caller.name} calling you</p>
					  </Modal.Body>

					  <Modal.Footer>
					    <Button variant="success" onClick={this.acceptCall}>Answer</Button>
					    <Button variant="danger" onClick={this.rejectCall}>Cancel</Button>
					  </Modal.Footer>      
		    </Modal>
			)
	}
} 

const mapStateToProps = (state) => {
  return {
    user: state.main_reducer.user,
	CallingModal:state.WindowToggle.CallingModal,
	//Header:state.WindowToggle.Header
	
  };
};

export default connect(mapStateToProps,actions)(CallingModal)