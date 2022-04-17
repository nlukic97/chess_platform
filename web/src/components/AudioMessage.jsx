import React, {useState} from 'react'
import './AudioMessage.scss'

const AudioMessage = ({msg}) => {
    const [progressBar, setProgressBar] = useState('0%')
    const voiceMsg = new Audio(msg.src)

    function togglePlay(){
        if(voiceMsg.paused){
            voiceMsg.play()
        } else {
            voiceMsg.pause()
        }
    }

    /* let duration
    voiceMsg.addEventListener('loadedmetadata', ()=> {
        duration = voiceMsg.duration //Infinity ?
    }); */


    voiceMsg.addEventListener('timeupdate',()=>{
        setProgressBar(voiceMsg.currentTime / voiceMsg.duration * 100 + '%') //fires but won't work until 50% of audio is played (duration is infinity until then)
    })
  return (
    <div>
        <div className={msg.class + " custom-player-container"}>
            <button className="play-btn" onClick={togglePlay}>Play</button>
            <div className="progress-bar" style={{width: progressBar}}></div>
        </div>
    </div>
  )
}

export default AudioMessage