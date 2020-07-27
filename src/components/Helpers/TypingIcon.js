import React from 'react'
import styled,{keyframes} from 'styled-components'

const goup = (props) => keyframes`
	  0% {top: ${props.size*2}px;}
	  28% {top: ${props.size}px;}
	  44% {top: ${props.size*2}px;}
`;

const TypingIconWrapper = styled.div`
	display:inline-block;
    position: relative;
	background-color: #f1f0f0;
	border-radius: ${(props)=>props.size*5}px;
	width:${(props)=>props.size*8}px;
	height:${(props)=>props.size*5}px;
`;

const typingIconCircle = styled.div`
	position: absolute;
	height: ${props=>props.size}px;
	width: ${props=>props.size}px;
	background-color: #8D949E;
	border-radius: ${props=>props.size}px;
	top:${props=>props.size*2}px;
	animation-name: ${props=>goup(props)};
	animation-duration: 1.5s;
	animation-iteration-count: infinite;
	animation-timing-function: ease-in-out;
	animation-direction: normal;
	animation-fill-mode: none;
	animation-play-state: running;
`

const Circle1 = styled(typingIconCircle)`
		left:${(props)=>(props.size*2)}px;
`
const Circle2 = styled(typingIconCircle)`
		left:${(props)=>(props.size*4)-(props.size/2)}px;
		animation-delay: 0.2s;
`
const Circle3 = styled(typingIconCircle)`
		left:${(props)=>(props.size*6)-(props.size)}px;
		animation-delay: 0.4s;
`
const TypingIcon = ({size}) => {
 return (
  <TypingIconWrapper size={parseInt(size)}>
   <Circle1 size={parseInt(size)}/>
   <Circle2 size={parseInt(size)}/>
   <Circle3 size={parseInt(size)}/>
  </TypingIconWrapper>
 )
}

export default TypingIcon