import FollowedArtists from '../components/Artists/FollowedArtists.js'
import { ArtistProvider } from '../context/ArtistContext.js'

const Artists = () => {
  return (
    <>
      <ArtistProvider>
        <FollowedArtists />
      </ArtistProvider>
    </>
  )
}

export default Artists
