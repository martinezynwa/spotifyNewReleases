import { useState, useEffect } from 'react'
import artistService from '../../services/artists.js'
import RemoveGroup from './RemoveGroup.js'

const SingleGroup = ({ group }) => {
  const [artistsOfGroup, setArtistsOfGroup] = useState([])

  useEffect(() => {
    const getData = async () => {
      await artistService
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
      <div key={group._id}>
        <div>{group.groupName}</div>
        <div>{group.connectedPlaylistName}</div>
        <div>
          {artistsOfGroup.map(a => (
            <div key={a._id}>{a.artistName}</div>
          ))}
        </div>
        <RemoveGroup id={group._id} />
      </div>
      <br />
    </>
  )
}

export default SingleGroup
