import React,{useState,useEffect} from 'react'
import {useSocket} from "../contexts/SocketProvider";
import './VoiceChat.scss'

function VoiceChat(){
    
    const [recording, setRecording]=useState(false)
    window.mediaRec = null;
    const {socket} = useSocket()
    
    const recordBtn =()=>{
        if(recording === false){
            setRecording(true) //recording
            record()
        } else {
            setRecording(false) //stop recording
            window.mediaRec.stop()
        }
    }
    
    function record(){
        navigator.mediaDevices.getUserMedia({audio:true})
        .then((mediaStream)=> {
            window.mediaRec = new MediaRecorder(mediaStream)
            
            console.log('mediaRecorder');
            
            window.mediaRec.onstart = function(e) {
                this.chunks = [];
                console.log('Started');
            };
            window.mediaRec.ondataavailable = function(e) {
                this.chunks.push(e.data);
            };
            window.mediaRec.onstop = async function(e) {
                console.log('ended');
                var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
                socket.emit('sendAudio', blob);
            }
            
            // Start recording
            window.mediaRec.start()
        });

    }
    useEffect(()=>{
        socket.on('receiveAudio',async (arrayBuffer)=>{
            var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
            var audio = document.createElement("audio")
            audio.src = window.URL.createObjectURL(blob)
            audio.play()
        })
    })
    
    return (
        <div className="container">
        <div>
        <button id="start" className='StartButton'
        style={{backgroundColor:recording ? 'red':'black', opacity:'0'}}
        onClick={recordBtn}>
        {recording ? 'Recording' : 'Record'}
        </button>
        </div>
        </div>
        )
    }
    
    export default VoiceChat