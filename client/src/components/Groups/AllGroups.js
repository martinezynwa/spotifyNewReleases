import { useState, useEffect } from 'react'
import groupService from '../../services/groups.js'
import SingleGroup from './SingleGroup.js'

const AllGroups = ({ alreadyAdded, list }) => {
  const [groups, setGroups] = useState([])

  useEffect(() => {
    const getData = async () => {
      await groupService
        .getGroups()
        .then(res => {
          setGroups(res)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    getData()
  }, [])

  if (list && alreadyAdded) {
    return (
      <>
        <option value>
          {alreadyAdded.connectedGroupName
            ? alreadyAdded.connectedGroupName
            : 'Not added'}
        </option>
        {groups
          .filter(g => g.groupName !== alreadyAdded.connectedGroupName)
          .map(g => (
            <option key={g._id} value={[g._id, g.groupName]}>
              {g.groupName}
            </option>
          ))}
      </>
    )
  }

  return (
    <>
      <div>
        <h2>Created Groups</h2>
        {groups.map(g => (
          <SingleGroup key={g._id} group={g} />
        ))}
      </div>
    </>
  )
}

export default AllGroups
