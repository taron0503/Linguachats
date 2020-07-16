import React, {Component} from "react"
import female_avatar from "../../images/myAvatar.png"
import "./style.css"

export default class UsersItem extends Component{
	render(){
		let user = this.props.user
		let newPartner = this.props.newPartner
		let symbol = user.gender==="Male"?`\u2640`:`\u2642` 
	    let imgsrc = user.gender==="Male"?"https://previews.123rf.com/images/yupiramos/yupiramos1609/yupiramos160912719/62358443-avatar-man-smiling-cartoon-male-person-user-vector-illustration.jpg":female_avatar
		let gender_class = user.gender==="Male"?"male":"female"
		let unread_messages = user.messages.reduce((count,message)=>{
			return message.unread?count+1:count
		},0)
		return (
	    		<div className="row no-gutter user_row" onClick={() => newPartner(user.socketid)} style={this.props.styles}>
	    		    <div className="col-sm-2 col-2 ">
		    		  <div className = "avatar-wrapper">	
		    			<img className="avatar" src = {imgsrc}/>
		   			  </div>
	    			</div>
	    		    <div className="col-10 col-sm-5">
				      <div style={{"fontWeight":"600"}}>{/*symbol+" "+*/user.fullname}</div>
				      <span className="user_data_label">Age:</span>
				      <span className="user_data">{user.age}</span>
				      <span className="user_data_label">Country:</span>
				      <span className="user_data">{" "+user.country}</span>
				    </div>
				    {/*<div className="col-sm-2">
				      {user.country}
				    </div>*/}
				    <div className="col-sm-5">
				      <div>
				      <span className="user_data_label">Speaks:</span>
				      <span className="user_data">{user.speaks.map(user=>" "+user)}</span>
				      </div>
				      <div>
				      <span className="user_data_label">Learns:</span>
				      <span className="user_data">{user.learns.map(user=>" "+user)}</span>
				      </div>
				       {user.chat && 
				      	<div className="chaticon">
					      	{unread_messages>0 && <div className="newMessageIcon">{unread_messages}</div>}
						    <img src={require("../../images/chaticon2.png")}/>	
					    </div>}
				    </div>
	    		</div>
				)
	}
} 
