import React, {Component} from "react"
import {Modal} from 'react-bootstrap';

import "./style.css"


class ProfileImagesModal extends Component{

    handleItemClick=(img)=>{
        this.props.changeImage(img)
        this.props.close();
    }

	render(){
		return(
			<Modal
                show={this.props.show}
                onHide={()=>{}}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton onClick={this.props.close}>
                <Modal.Title id="example-custom-modal-styling-title">
                    Choose Profile Picture
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="ProfileImagesContainer">
                        {this.props.profileImages.map((img,id)=>{
                            let imgsrc = require("../../images/profileImages/"+img)
                            return <div className="ProfileImagewrapper" key={id} onClick={()=>this.handleItemClick(img)}>
                                <img src={imgsrc}/>
                            </div>
                        })}
                   </div> 
                </Modal.Body>
            </Modal>
		    	
		   	
			)
	}
}		
export default ProfileImagesModal