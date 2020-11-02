import React, {Component} from "react"
import UserIcon from "../UserIcon"
import ChatIcon from '../ChatIcon';
import TypingIcon from '../Helpers/TypingIcon';

import "./style.css"

export default class UsersItem extends Component{
	render(){
		let user = this.props.user
		let unread_messages = user.messages.reduce((count,message)=>{
			return message.unread?count+1:count
		},0)
		let handleClick = ()=>{}
		let style = {}
		if(this.props.main_user.partnerId===user.socketid){
			style={background:"lavender"}
		}
		if(this.props.main_user.socketid!==user.socketid){
			handleClick = ()=>{this.props.handleUserItemClick(user)}
		}
		return (
	    		<div className="row no-gutter user_row" onClick={handleClick} style={style}>
	    		    <div className="col-sm-2 col-2 ">
		    		  		<UserIcon size="50" img={user.img} status={user.status}/>
	    			</div>
	    		    <div className="col-10 col-sm-6">
				      <div style={{"fontWeight":"600"}}>{/*symbol+" "+*/user.fullname+" "}
				      {user.typing && <TypingIcon size={3}/>}</div>
				      <span className="user_data_label">Age:</span>
				      <span className="user_data">{user.age}</span>
				      <span className="user_data_label">Country:</span>
				      <span className="user_data">{" "+user.country}</span>
				    </div>
				    <div className="col-sm-4">
				      <div>
					      <span className="user_data_label">Speaks:</span>
					      <span className="user_data" style={user.speaks.length>2?{fontSize:"11px"}:{}}>
					       {user.speaks.map((language,index)=>{
					       	if(index===0) 
					       		return language
					       	return ", "+language
					       	})
					       }
					      </span>
				      </div>
				      <div>
					      <span className="user_data_label">Learns:</span>
					      <span className="user_data" style={user.learns.length>2?{fontSize:"11px"}:{}}>
					      {user.learns.map(language=>" "+language)}</span>
				      </div>
				    </div>
				    {user.chat && 
				    	<ChatIcon unread_messages={unread_messages} imgsrc={"chaticon2.png"} size={"20"}
				    	          styles={{margin:" 0 4px 2px",
																position: "absolute",
																right:"0px",
																bottom: "0px"}}/>
					}
	    		</div>
				)
	}
} 
