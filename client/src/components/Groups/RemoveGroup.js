import useGroup from '../../context/GroupContext'

const RemoveGroup = ({ id }) => {
  const { removeGroup } = useGroup()

  return (
    <button
      className="flex bg-active mt-4 w-28 p-2 font-semibold rounded-2xl"
      onClick={() => removeGroup(id)}>
      <h2 className='mx-auto text-center md:text-base text-xs'>Delete group</h2>
    </button>
  )
}

export default RemoveGroup
