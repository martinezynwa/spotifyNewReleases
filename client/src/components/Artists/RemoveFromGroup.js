import useArtist from '../../context/ArtistContext.js'

const RemoveFromGroup = ({ id }) => {
  const { removeArtistFromGroup } = useArtist()

  return <button onClick={() => removeArtistFromGroup(id)}>Remove</button>
}

export default RemoveFromGroup
