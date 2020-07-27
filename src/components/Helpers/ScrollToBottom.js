import React, {Component} from "react"

export default class ScrollToBottom extends Component{
	scrollToBottom = () => {
	  this.messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	  // this.messagesEnd.parentNode.scrollTop = this.messagesEnd.offsetTop;
	}

	componentDidMount() {
	  this.scrollToBottom();
	}

	componentDidUpdate() {
	  this.scrollToBottom();
	}
	render(){
		return (<div className={this.props.className} style={{...this.props.style,position:"relative"}}>
		{this.props.children}
		<div style={{ position:"absolute", bottom: "0" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
		</div>)
	}
}