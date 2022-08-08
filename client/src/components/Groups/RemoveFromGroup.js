import groupService from '../../services/groups.js'

const RemoveFromGroup = ({ id }) => {
  return (
    <button onClick={async () => await groupService.removeArtistFromGroup(id)}>
      Remove
    </button>
  )
}

export default RemoveFromGroup
