import React, {Component} from "react"
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Select from 'react-select'
import styles from "./style.module.css"


class ProfileDropdown extends Component{
	constructor(props){
		super(props)
		this.options = [
		{value:"name",label:"Name"},
		{value:"age",label:"Age"},
		{value:"country",label:"Country"},
		{value:"speaks",label:"Speaks"},
		{value:"learns",label:"Learns"},
		{value:"time",label:"Online Date"}
	]
		this.state={sortField:this.options[5],reverse:false}
	}

 	handleChange=(e)=>{
 		this.setState({sortField:e,reverse:false},()=>
 		{this.props.sortUsers(e.value,this.state.reverse)})
 	}

 	handleClick=(reverse)=>{
 		this.setState({reverse:!this.state.reverse},()=>{
 		this.props.sortUsers(this.state.sortField.value,this.state.reverse)})
 	}

  render(){
  	const customStyles = {
	  control: (provided) => ({
	    ...provided,
	    boxShadow: 'none',
	    minHeight:"auto",
	    //marginLeft: "2%",
	  }),
	  container:(provided)=>({
	  	...provided,
	  	display:"inline-block",
	  	width:"50%",
	  	marginLeft: "4%",
	  	marginRight: "4%",
	  }),
	  valueContainer:(provided)=>({
	  	...provided,
	  	padding:"0"
	  }),
	  indicatorSeparator:(provided)=>({
	  	...provided,
	  	display:"none"
	  }),
	  dropdownIndicator:(provided)=>({
	  	...provided,
	  	padding:"0",
	  	"paddingRight":"5px",
	  })
	}
	  return(
	  	<div className={styles.UsersSortDropdown}>
	  		<span>Sort By</span>
	  		<Select 
	  		styles = { customStyles }
	  		options={this.options}
	  		defaultValue={this.state.sortField}
	  		onChange = {(e)=>{this.handleChange(e,false)}}
	  		/>
	  		<button type="button" className={styles.sortButton+" btn btn-secondary btn-sm"}
	  				onClick = {()=>{this.handleClick(true)}}>↑↓</button>
	  	</div>
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