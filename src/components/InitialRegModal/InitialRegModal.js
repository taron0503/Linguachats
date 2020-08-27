import React, {Component} from "react"
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Select from 'react-select'
import {Modal,Button,InputGroup,FormControl,FormGroup} from 'react-bootstrap';
import ProfileImagesModal from "../ProfileImagesModal/ProfileImagesModal"
import { Formik } from 'formik';
import * as Yup from 'yup';
import countries from "../../services/countries"
import languages from "../../services/languages"
import ages from "../../services/ages"
import "./style.css"




const selectStyles = {
    container: (provided, state) => {
    const flex = "1 1 auto";
    return { ...provided, flex };
  }
}

let profileImages = ["avatarM.png","avatarM2.png","avatarM3.png","avatarM4.png","avatarM5.png","avatarM6.png",
"avatarF.png","avatarF2.png","avatarF3.png","avatarF4.png","avatarF5.png","avatarF6.png"]


class InitialRegModal extends Component{
	constructor(props){
		super(props)
		this.imgRef = React.createRef()
		this.state={showProfileImagesModal:false}
	}

	handleClose = (resetForm)=>{
		resetForm({})
		this.props.toggleInitRegToEdit(false);
		this.props.toggleInitReg(false);
	}

	handleImageChange=(img,setFieldValue)=>{
			//this.setState({profile_image_src:img})
			setFieldValue("profile_image_src",img)
			this.imgRef.current.src=require("../../images/profileImages/"+img)
	}

	handleGenderChange=(gender,setFieldValue,field)=>{
		setFieldValue(field,gender)
		if(gender==="Male")
			this.handleImageChange("avatarM.png",setFieldValue)
		if(gender==="Female")
			this.handleImageChange("avatarF.png",setFieldValue)
	}

	handleLanguageOnChange(options,setFieldValue,field){
		let languages=[]
		if(options){
		options.forEach(option=>{
			languages.push(option.label)
		})
		setFieldValue(field,languages)
	}
	}

	gender_options = [
	  { value: 'Male', label: 'Male' },
	  { value: 'Female', label: 'Female' },
	]

	

	render(){
		let user=this.props.user
		let imgsrc = require("../../images/profileImages/"+user.profile_image_src)
		return(
			<React.Fragment>
				<Formik
				      enableReinitialize={true}
				      initialValues={{ name: user.name,
										surname:user.surname,
										age:user.age.toString(),
										gender:user.gender,
										country:user.country,
										speaks:user.speaks,
										learns:user.learns,
										profile_image_src:user.profile_image_src,
										muk:"dzuk", }}
				      validationSchema={Yup.object({
						        name: Yup.string()
						          .max(20, 'Must be 2-20 characters')
						          .min(2, 'Must be 2-20 characters')
						          .required('Name is required'),
						        surname: Yup.string()
						          .max(20, 'Must be 2-20 characters')
						          .min(1, 'Must be 1-20 characters')
						          .required('Surname is required'),
						        age: Yup.string()
						          .required('Age is Required'),
						        speaks: Yup.array()
						          .required('Must be at least one language'),
						        learns: Yup.array()
						          .required('Must be at least one language')
						          .min(1,"Must be at least one language"),
						  })}
				      onSubmit={(values, actions) => {
						 // console.log(values)
				        this.props.handleModalConfirmation(values)
				        actions.resetForm({});
				      }}
				    >
				    {({values,errors,touched,handleChange,handleBlur, isSubmitting, handleSubmit,setFieldValue,resetForm})=>{/*console.log(values)*/;return(
						<Modal show={this.props.show || this.props.edit} onHide={this.handleClose} backdrop="static">
								<form onSubmit={handleSubmit}>
						<Modal.Header>
						<Modal.Title>{this.props.edit?"Edit":"Register"}</Modal.Title>
						{this.props.edit && <button type="button" className="close" aria-label="Close" onClick={()=>{this.handleClose(resetForm)}}>
									<span aria-hidden="true">&times;</span>
									</button>}
						</Modal.Header>
						<Modal.Body>
							
							<FormGroup>
								<div className="row">
								<div className="col-9">
									<InputGroup className="mb-3">
										<InputGroup.Prepend>
										<InputGroup.Text>Name</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl
											placeholder="..."
										name="name"
										onChange={handleChange}
										onBlur={handleBlur}
										value = {values.name}
										/>
									</InputGroup>
									
									{errors.name && touched.name && <p className="error">{errors.name}</p>}

									
									<InputGroup className="mb-3">
										<InputGroup.Prepend>
										<InputGroup.Text>Surname</InputGroup.Text>
										</InputGroup.Prepend>
										<FormControl
											placeholder="..."
										name="surname"
										onChange={handleChange}
										onBlur={handleBlur}
										value = {values.surname}
										/>
									</InputGroup>
									{errors.surname && touched.surname && <p className="error">{errors.surname}</p>}
								</div>
								<div className="col-3">
									<div className="profileImageWrapper"  
										onClick={()=>{this.setState({showProfileImagesModal:true})}}>
										<img src = {imgsrc} ref={this.imgRef}/>
									</div>
								</div>
							</div>
							</FormGroup>
						
							<FormGroup>

							<InputGroup className="mb-3">
								<InputGroup.Prepend>
								<InputGroup.Text>Age</InputGroup.Text>
								</InputGroup.Prepend>
								<Select className="mr-1" styles={selectStyles} 
													options={ages}
													name="age"
													onChange={option=>setFieldValue("age",option.value)}
												onBlur={handleBlur}
												defaultValue = {ages.find(age=>age.value===values.age)}
												/>
								{errors.age && touched.age && <p className="error">{errors.age}</p>}

								<InputGroup.Prepend className="ml-5">
								<InputGroup.Text>Gender</InputGroup.Text>
								</InputGroup.Prepend>
									<Select styles={selectStyles} 
													options={this.gender_options}
													name="gender"
													onChange={option=>{this.handleGenderChange(option.label,setFieldValue,"gender")}}
												onBlur={handleBlur}
													defaultValue = {this.gender_options.find(gender=>gender.label===values.gender)}/>	   
							</InputGroup>
							</FormGroup>
							
							<FormGroup>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
								<InputGroup.Text>Country</InputGroup.Text>
								</InputGroup.Prepend>
								<Select styles={selectStyles} 
												options={countries}
												name="country"
											onChange={option=>setFieldValue("country",option.label)}
											onBlur={handleBlur}
											defaultValue = {countries.find(country=>country.label===values.country)}
								/>
							</InputGroup>
							</FormGroup>
							<FormGroup>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
								<InputGroup.Text>Language you speak</InputGroup.Text>
								</InputGroup.Prepend>
								<Select styles={selectStyles}
												isMulti 
												options={languages}
												name="speaks"
											onChange={options=>{this.handleLanguageOnChange(options,setFieldValue,"speaks")}}
											onBlur={handleBlur}
											defaultValue = {languages.filter(language=>values.speaks.includes(language.label))}
								/>
								{errors.speaks && touched.speaks && <p className="error">{errors.speaks}</p>}
							</InputGroup>
							</FormGroup>
							<FormGroup>
							<InputGroup className="mb-3">
								<InputGroup.Prepend>
								<InputGroup.Text>Language you want to practice</InputGroup.Text>
								</InputGroup.Prepend>
								<Select styles={selectStyles}
												isMulti 
												options={languages}
												name="learns"
											onChange={options=>{this.handleLanguageOnChange(options,setFieldValue,"learns")}}
											onBlur={handleBlur}
											defaultValue = {languages.filter(language=>values.learns.includes(language.label))}
								/>
								{errors.learns && touched.learns && <p className="error">{errors.learns}</p>}
							</InputGroup>
							</FormGroup>
							<FormControl
										name="profile_image_src"
										type="hidden"
										onChange={handleChange}
										value = {values.profile_image_src}
										/>
						</Modal.Body>
						<Modal.Footer>
						<Button type="submit" variant="primary" disabled={isSubmitting}>
							{this.props.edit?"Edit":"Next"}
						</Button>
						</Modal.Footer>
						</form>
						<ProfileImagesModal show={this.state.showProfileImagesModal} 
								  close={()=>{this.setState({showProfileImagesModal:false})}}
								  profileImages={profileImages}
								  changeImage={(img)=>{this.handleImageChange(img,setFieldValue,"profile_image_src")}}/>
					</Modal>
					)}}
		      </Formik>
			  
		</React.Fragment>
			)
	}
} 

const mapStateToProps = (state) => {
	state = state.main_reducer
  return {
    user: state.user,
    edit:state.InitReg.edit
  };
};

export default connect(mapStateToProps,actions)(InitialRegModal)