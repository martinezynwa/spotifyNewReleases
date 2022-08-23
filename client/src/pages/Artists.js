import SyncArtists from '../components/Artists/SyncArtists.js'
import AddedArtists from '../components/Artists/AddedArtists.js'
import { ArtistProvider } from '../context/ArtistContext.js'

const Artists = () => {
  return (
    <>
      <ArtistProvider>
        <SyncArtists />
        <AddedArtists />
      </ArtistProvider>
    </>
  )
}

export default Artists
