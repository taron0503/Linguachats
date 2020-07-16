import React, {Component} from "react"
import {emojies, get_emoji_byName} from "./Emojies.js"
import "./style.css"

export default class InitialRegModal extends Component{

	setModalRef = element => {
      this.ModalRef = element;
  	}

  	setShowModalRef = element => {
      this.showModalRef = element;
  	}

	componentDidMount() {
    	document.addEventListener('mousedown', this.closeModal);
   	}

  	componentWillUnmount() {
    	document.removeEventListener('mousedown', this.closeModal);
    }

	showModal=()=>{
		console.log("open")
		if(this.props.EmojiPicker_show){
			this.props.hide()
		}else{
			this.props.show()
		}
		// this.setState({show:!this.state.show})
	}

	closeModal=(event)=>{
		if (this.ModalRef && !this.ModalRef.contains(event.target) && event.target!==this.showModalRef) {
      		this.props.hide()
    	}
	}

	render(){
		let main_emoji = get_emoji_byName("emoji00")
		let emoji_main_icon = {
			background:`${main_emoji.url} 0 0 no-repeat`,
			backgroundSize:"540px 140px",
			width:"20px",
			height:"20px",
			cursor:"pointer",
		}
		return(
			<div className = "EmojiPicker">
				<div style={emoji_main_icon} onClick={this.showModal} ref={this.setShowModalRef}></div>
				{this.props.EmojiPicker_show && 
					<div className="EmojiPickerModal Cscroll" ref={this.setModalRef}>
						{emojies.map((emoji,index)=>{
							return <div className="emoji-icon"
										key = {index}
										style={{background:`${emoji.url} ${emoji.left} ${emoji.top} no-repeat`,
												backgroundSize:emoji.backgroundSize
									           }}
									    onClick={()=>{this.props.addEmoji(emoji.name)}}>
									</div>
						})}
					</div>}
			</div>
			)
	}
}


