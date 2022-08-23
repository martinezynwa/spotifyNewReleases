import useArtist from '../../context/ArtistContext.js'

const SyncArtists = () => {
  const { syncFollowedArtists, removeUnfollowed } = useArtist()

  return (
    <>
      <button onClick={() => syncFollowedArtists()}>Synchronize</button>
      <button onClick={() => removeUnfollowed()}>Remove unfollowed </button>
    </>
  )
}

export default SyncArtists
