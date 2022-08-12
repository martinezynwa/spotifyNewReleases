import { accessToken } from '../../util/spotifyAuth.js'
import useArtist from '../../context/ArtistContext.js'

const UnfollowButton = ({ id }) => {
  const { unfollowArtist } = useArtist()

  return (
    <button onClick={() => unfollowArtist(id, accessToken)}>Unfollow</button>
  )
}

export default UnfollowButton
