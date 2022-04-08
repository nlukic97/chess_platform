import './VoiceChat.scss'
import React,{useState, useEffect} from 'react'

const VoiceChat = () => {

    const [message,setMessage] = useState('Not recording')
    const [recordingStatus,setrecordingStatus] = useState(false)
    const [playerSrc,setPlayerSrc] = useState('')
    const chunks = []

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("audio recording supported")
    } else {
        console.log("audio recording is not supported on your browser!")
    }
    
    function startRecording(){
        if(recordingStatus === true) return null
        setrecordingStatus(true)
        setMessage('Recording...')
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        })
        .then(handleSuccess.bind(this))
        .catch(e=>{
            console.log(e);
        })
    }
    function stopRecording(){
        if(recordingStatus === false) return null
        setrecordingStatus(false)
        setMessage('Not recording')
    }

    function onMediaRecorderDataAvailable(e) { this.chunks.push(e.data) }

    function onMediaRecorderStop(e){ 
        const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' })
			const audioURL = window.URL.createObjectURL(blob)
			setPlayerSrc(audioURL)
			this.chunks = []
			this.stream.getAudioTracks().forEach(track => track.stop())
			this.stream = null
    }

    
    function handleSuccess(streamHandled){
        const stream = streamHandled
        console.log(stream);
        stream.oninactive = ()=>{
            console.log('stream ended');
        }
        var mediaRecorder = new MediaRecorder(stream)
        console.log(mediaRecorder);

        mediaRecorder.ondataavailable = (e)=> onMediaRecorderDataAvailable(e)
        mediaRecorder.onstop = (e) => onMediaRecorderStop(e)
    }

  return (
    <div className="container">
        <audio id="recorder" muted hidden></audio>
        <div>
            <button id="start" onClick={startRecording}>Record</button>
            <button id="stop" onClick={stopRecording}>Stop Recording</button>
        </div>
        <span>{message}</span>
        <audio id="player" controls src={playerSrc}></audio>
    </div>
  )
}

export default VoiceChat