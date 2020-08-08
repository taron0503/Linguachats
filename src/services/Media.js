let Media={
	stream:undefined,
	start:async function(){this.stream = await navigator.mediaDevices.getUserMedia( { video: true, audio: true })},
	end:async function(){let tracks = this.stream.getTracks()
			  tracks.forEach((track)=>{
		      track.stop();
			  });
			},
    videoOff:async function(){
		const videoTracks = this.stream.getVideoTracks();
		videoTracks[0].stop()
		this.stream.removeTrack(videoTracks[0])

	},
	videoOn:async function(){
		let videostream = await navigator.mediaDevices.getUserMedia( { video: true})
		const videoTracks = videostream.getVideoTracks();
		this.stream.addTrack(videoTracks[0]);
	},

	audioOff:async function(){
		const audioTracks = this.stream.getAudioTracks();
		console.log(audioTracks)
		audioTracks[0].stop()
		this.stream.removeTrack(audioTracks[0])
	},

	audioOn:async function(){
		let audiostream = await navigator.mediaDevices.getUserMedia( { audio: true})
		const audioTracks = audiostream.getAudioTracks();
		this.stream.addTrack(audioTracks[0]);
	}

}

export default Media