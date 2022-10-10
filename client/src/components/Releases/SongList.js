import noAlbumArt from '../../assets/img/missing_album.jpg'

const SongList = ({ songs, artist }) => {
  const convertMs = songDuration => {
    const minutes = new Date(songDuration).getMinutes()
    const seconds = () => {
      let seconds = new Date(songDuration).getSeconds()
      if (seconds === 0) return '00'
      if (seconds.toString().length === 1 && seconds !== 0) {
        return `0${seconds}`
      }
      return seconds
    }
    const converted = `${minutes}:${seconds()}`
    return converted
  }

  const fullDuration = () => {
    let total = 0
    songs.map(s => (total = total + s.songDuration))
    return convertMs(total)
  }

  const textSize = albumName => {
    if (albumName.length >= 0 && albumName.length <= 15) return 'md:text-7xl'
    if (albumName.length >= 16 && albumName.length <= 30) return 'md:text-6xl'
    if (albumName.length >= 31 && albumName.length <= 45) return 'md:text-5xl'
    if (albumName.length > 46) return 'md:text-4xl'
  }

  return (
    <>
      <div className="flex flex-col md:flex-row mb-4 md:py-16 md:pt-10 px-4 h-80 bg-gradient-to-b from-[#1E3264] to-black">
        <img
          src={artist.albumImage !== '' ? artist.albumImage : noAlbumArt}
          alt=""
          className="flex m-auto md:m-0 md:my-auto md:mb-10 md:mr-5 md:ml-4 w-48 h-48 md:w-56 md:h-56 object-cover shadow-2xl"
        />
        <div className="flex flex-col mb-5 ml-0 md:ml-0 md:my-auto gap-[2px] md:gap-[5px]">
          <p
            className={`font-bold ${textSize(
              artist.albumName,
            )} md:text-7xl md:mb-5`}>
            {artist.albumName}
          </p>
          <p className="font-semibold text-xs md:text-xl md:ml-1">
            {artist.artistName}
          </p>
          <p className="text-[11px] md:text-1xl md:ml-1">
            {artist.albumType} - {artist.releaseDate.substring(0, 4)}
          </p>
          <p className="hidden md:flex md:text-xs md:ml-1">{`${
            songs.length
          } song${songs.length > 1 ? 's' : ''} - ${fullDuration()}   `}</p>
        </div>
      </div>
      <div></div>
      {songs.map((s, i) => (
        <div
          key={i}
          className={
            'flex flex-row px-6 py-2 md:mx-2 -mx-2 items-center md:hover:bg-active rounded'
          }>
          <p className="hidden md:flex md:mr-0 md:w-9">{s.songNumber}</p>
          <div className="flex flex-col md:-space-y-[5px]">
            <p className="line-clamp-1 font-medium text-sm md:text-base">
              {s.songName}
            </p>
            <p className="text-link text-xs md:text-sm">{s.songArtist}</p>
          </div>
          <p className="text-link ml-auto">{convertMs(s.songDuration)}</p>
        </div>
      ))}
    </>
  )
}

export default SongList
