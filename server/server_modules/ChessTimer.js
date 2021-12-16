function milisecondsToTime(ms){
    let formatMinutes = 0;
    let formatSeconds = 0
    let formatMs = 0;
    
    while(ms / 1000 >= 1){
        ms -= 1000
        formatSeconds += 1
    }

    while(formatSeconds / 60 >= 1) {
        formatMinutes += 1
        formatSeconds -= 60
    }

    formatMinutes = (formatMinutes < 10) ? '0' + formatMinutes.toString() : formatMinutes.toString(); 
    formatSeconds = (formatSeconds < 10) ? '0' + formatSeconds.toString() : formatSeconds.toString();

    
    formatMs = ms / 100
    formatMs = formatMs.toString();

    

    return formatMinutes + ':'+ formatSeconds + "." + formatMs;
}


function StartTimer(insertedTime){
    let fullTime = insertedTime
    let time = insertedTime

    let interval = setInterval(()=>{
        time -= 100
        console.log(milisecondsToTime(time))
        if(time === 0){
            clearInterval(interval)
        }
    },100)
}

module.exports = {milisecondsToTime, StartTimer}