import useGroup from '../../context/GroupContext'

const RemoveGroup = ({ id }) => {
  const { removeGroup } = useGroup()

  return (
    <button
      className="flex bg-active mt-4 w-28 p-2 font-semibold rounded-2xl"
      onClick={() => removeGroup(id)}>
      Delete group
    </button>
  )
}

export default RemoveGroup
