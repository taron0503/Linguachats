let Media={
	stream:undefined,
	start:async function(){this.stream = await navigator.mediaDevices.getUserMedia( { video: true, audio: true })},
	end:async function(){let tracks = this.stream.getTracks()
			  tracks.forEach((track)=>{
		      track.stop();
			  });
			},
    videoOff:async function(){
		let tracks = this.stream.getTracks()
		console.log(tracks)
		tracks.find(track=>track.kind==="video").stop()
	}

}

export default Media