import React,{useState,useEffect} from 'react'
import {useSocket} from "../contexts/SocketProvider";
import './VoiceChat.scss'

function VoiceChat(){
    const [recording, setRecording]=useState(false)
    window.mediaRec = null;
    const {socket} = useSocket()
    
    const recordBtn =()=>{
        if(recording === false){            
            setRecording(true) // tells user their voice is being recorded
            /* Problem - changing the state in an interval, or in the line I would like to causes an error */
            record()
        } else {
            setRecording(false) // tells user their voice is not being recorded anymore
            window.mediaRec.stop()
        }
    }
    
    async function record(){
        const mediaStream = await navigator.mediaDevices.getUserMedia({audio:true})
        window.mediaRec = await new MediaRecorder(mediaStream)
        
        // I want setRecording(true) to be executed here, after we have the mediaRecorder
        // but I don't know how to make it work ------- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
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
            
            // Stoping browser use of microphone (removes the red dot from the browser tab)
            mediaStream.getAudioTracks().forEach(track=>{
                track.stop()
            })
        }
        
        // Start recording
        window.mediaRec.start()
        
    }
    
    return (
        <div className="container">
        <div>
        <button id="start" className='StartButton'
        style={{backgroundColor:recording ? 'red':'black'}}
        onClick={recordBtn}>
        {recording ? 'Recording' : 'Record'}
        </button>
        </div>
        </div>
        )
    }
    
    export default VoiceChat