import useArtist from '../../context/ArtistContext.js'

const GroupSelection = ({ groupName }) => {
  const { groups } = useArtist()

  return (
    <>
      {<option value>{groupName ? groupName : 'Not added'}</option>}
      {groups
        ? groups
            .filter(g => g.groupName !== groupName)
            .map(g => (
              <option key={g._id} value={[g._id, g.groupName]}>
                {g.groupName}
              </option>
            ))
        : null}
      {groupName ? <option>Not added</option> : null}
    </>
  )
}

export default GroupSelection
