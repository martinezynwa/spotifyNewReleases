import SingleGroup from './SingleGroup.js'
import useGroup from '../../context/GroupContext.js'

const AllGroups = () => {
  const { groups } = useGroup()

  return (
    <>
      <div>
        <h2>Created Groups</h2>
        {groups
          ? groups.map((g, i) => <SingleGroup key={i} group={g} />)
          : null}
      </div>
    </>
  )
}

export default AllGroups
