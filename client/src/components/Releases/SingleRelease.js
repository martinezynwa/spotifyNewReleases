import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import noAlbumArt from '../../assets/img/missing_album.jpg'

//Component showing songs inside album
const SingleRelease = ({ artist }) => {
  return (
    <>
      <Link to={`/releases/${artist.albumId}`} state={{ artistDetail: artist }}>
        <div className="flex flex-row md:flex-col bg-album p-4 cursor-pointer hover:bg-active border-b-[1px] border-stone-800 md:border-b-0 rounded-none md:rounded">
          <div className="mb-4 rounded">
            <img
              src={artist.albumImage !== '' ? artist.albumImage : noAlbumArt}
              alt=""
              className="max-w-none object-cover w-32 h-32 md:rounded md:w-full md:h-full hover:scale-110 transition duration-300 ease-in-out"
            />
          </div>
          <div className="flex mt-1 md:mt0 flex-col ml-2 md:ml-0">
            <div className="flex flex-col md:flex-row md:justify-between text-xs text-link">
              <p>{artist.albumType}</p>
              <p>{dayjs(artist.releaseDate).format('Do MMM')}</p>
            </div>
            <div className="flex flex-col">
              <p className="md:line-clamp-1 font-medium md:font-semibold text-white mt-2">
                {artist.albumName}
              </p>
              <p className="text-link text-xs md:text-s">{artist.artistName}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default SingleRelease
