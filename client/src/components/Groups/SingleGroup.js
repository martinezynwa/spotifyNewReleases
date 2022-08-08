import { useState, useEffect } from 'react'
import '../../styles/components/Groups.css'
import groupService from '../../services/groups.js'

const SingleGroup = ({ group }) => {
  const [artistsOfGroup, setArtistsOfGroup] = useState([])
  useEffect(() => {
    const getData = async () => {
      await groupService
        .getArtistsFromGroups(group._id)
        .then(res => {
          setArtistsOfGroup(res)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    getData()
  }, [group._id])
  return (
    <>
      <div className="single-group" key={group._id}>
        <div>{group.groupName}</div>
        <div>{group.connectedPlaylistName}</div>
        <div>
          {artistsOfGroup.map(a => (
            <div key={a._id}>{a.artistName}</div>
          ))}
        </div>
      </div>
      <br />
    </>
  )
}

export default SingleGroup
