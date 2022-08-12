import { useState, useEffect } from 'react'
import groupService from '../../services/groups.js'

const GroupSelection = ({ groupName }) => {
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

  return (
    <>
      {<option value>{groupName ? groupName : 'Not added'}</option>}
      {groups
        .filter(g => g.groupName !== groupName)
        .map(g => (
          <option key={g._id} value={[g._id, g.groupName]}>
            {g.groupName}
          </option>
        ))}
    </>
  )
}

export default GroupSelection
