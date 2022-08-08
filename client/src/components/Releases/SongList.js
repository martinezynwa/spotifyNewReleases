const SongList = ({ songs }) => {
  const convertMs = duration_ms => {
    const minutes = new Date(duration_ms).getMinutes()
    const seconds = () => {
      let seconds = new Date(duration_ms).getSeconds()
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
        <div>
          {s.track_number} - {s.artists} {s.song_name} -{' '}
          {convertMs(s.duration_ms)}
        </div>
      ))}
    </>
  )
}

export default SongList
