import React, {
    useState,
    useEffect
} from 'react'
import {
    useSocket
} from "../contexts/SocketProvider";
import './VoiceChat.scss'

function VoiceChat({setMessages}) {
    const [isRecording, setIsRecording] = useState(false)
    const [startRecording, setStartRecording] = useState(false)
    // window.mediaRec = null;
    const [mediaRec, setMediaRec] = useState(null)
    const {socket} = useSocket()

    const recordBtn = () => {
        if (startRecording === false) {
            setStartRecording(true) // tells user their voice is being recorded
            /* Problem - changing the state in an interval, or in the line I would like to causes an error */
            // record()
        } else {
            setStartRecording(false) // tells user their voice is not being recorded anymore
            // mediaRec.stop()
        }
    }

    useEffect(() => {
        if (startRecording) {
            record()
            return
        }
        mediaRec?.stop()
    }, [startRecording])

    async function record() {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        })
        const mediaRecorderLocal = new MediaRecorder(mediaStream)
        mediaRecorderLocal.onstart = function (e) {
            setIsRecording(true)
            this.chunks = [];
            console.log('Started');
        }
        mediaRecorderLocal.ondataavailable = function (e) {
            this.chunks.push(e.data);
        }
        mediaRecorderLocal.onstop = async function (e) {
            console.log('ended');
            var blob = new Blob(this.chunks, {
                'type': 'audio/ogg; codecs=opus'
            });
            socket.emit('sendAudio', blob);
            setMessages(oldMsgs => [...oldMsgs, {type:'voice',src:window.URL.createObjectURL(blob), class:'me', timestamp: new Date().getTime()}])


            // Stoping browser use of microphone (removes the red dot from the browser tab)
            mediaStream.getAudioTracks().forEach(track => {
                track.stop()
            })
            setIsRecording(false)
            
        }
        setMediaRec(mediaRecorderLocal)

        mediaRecorderLocal.start()
    }

    return ( 
        <div className = "container">
            <div>
                <button 
                    id="start"
                    className='StartButton'
                    style={{backgroundColor: isRecording ? 'red' : 'black'}}
                    onClick={recordBtn}>
                    {startRecording ? isRecording ? 'Recording' : "Ko ovo procita otpala mu kita" : 'Record'} 
                </button> 
            </div> 
        </div>
    )
}

export default VoiceChat