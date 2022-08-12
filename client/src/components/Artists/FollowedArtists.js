import SingleArtist from './SingleArtist.js'
import useArtist from '../../context/ArtistContext.js'

const FollowedArtists = () => {
  const { artists } = useArtist()

  return (
    <>
      <div>
        <h2>Followed Artists</h2>
        {artists
          ? artists.map(a => <SingleArtist key={a.id} artist={a} />)
          : null}
      </div>
    </>
  )
}

export default FollowedArtists
