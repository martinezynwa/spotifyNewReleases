const SongList = ({ songs }) => {
  const convertMs = songDuration => {
    const minutes = new Date(songDuration).getMinutes()
    const seconds = () => {
      let seconds = new Date(songDuration).getSeconds()
      if (seconds === 0) {
        return '00'
      }
      if (seconds.toString().length === 1 && seconds !== 0) {
        return `0${seconds}`
      }
      return seconds
    }
    const converted = `${minutes}:${seconds()}`
    return converted
  }

  return (
    <>
      {songs.map(s => (
        <div key={(s.songNumber, s.songDuration)}>
          {s.songNumber} | {s.songArtist} | {s.songName} |{' '}
          {convertMs(s.songDuration)}
        </div>
      ))}
    </>
  )
}

export default SongList
