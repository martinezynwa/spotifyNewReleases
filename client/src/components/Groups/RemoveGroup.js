import useGroup from '../../context/GroupContext'

const RemoveGroup = ({ id }) => {
  const { removeGroup } = useGroup()

  return <button onClick={() => removeGroup(id)}>Remove</button>
}

export default RemoveGroup
