import SelectGroupDropdown from './SelectGroupDropdown.js'

const SingleArtist = ({ artist }) => {
  return (
    <>
      <div className="flex flex-row mt-2 md:mt-5 rounded-lg md: md:flex-col md:bg-album md:hover:bg-active">
        <div className="md:pt-3 md:mx-auto">
          <img
            src={artist.artistImage}
            alt=""
            className="w-20 h-16 object-cover rounded-full md:w-48 md:h-48 hover:scale-105 transition duration-300 ease-in-out"
          />
        </div>
        <div className="flex items-center md:mb-4 justify-between w-[100%] md:px-5 md:pt-5">
          <h6 className="ml-4 md:ml-0 line-clamp-1 font-semibold white">
            {artist.artistName}
          </h6>
          <SelectGroupDropdown
            artistDetails={{
              artistId: artist._id,
              connectedGroupId: artist.connectedGroupId,
              connectedGroupName: artist.connectedGroupName,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default SingleArtist
