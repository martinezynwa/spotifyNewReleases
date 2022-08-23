import SingleArtist from './SingleArtist.js'
import useArtist from '../../context/ArtistContext.js'

const AddedArtists = () => {
  const { artists } = useArtist()

  return (
    <>
      <div>
        {artists
          ? artists.map(a => <SingleArtist key={a._id} artist={a} />)
          : null}
      </div>
    </>
  )
}

export default AddedArtists
