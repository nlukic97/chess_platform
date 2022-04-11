const PlayCheckAudio = (game) => {
    if(!game.in_check()) return
    const songList = ['1.mp3']

    const audio = document.createElement('audio')
    audio.src = './audio/' + songList[0]
    audio.play()
}

module.exports = {
    PlayCheckAudio
}