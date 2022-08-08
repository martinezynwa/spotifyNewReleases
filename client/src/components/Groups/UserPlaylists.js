import { useState, useEffect } from 'react'
import userService from '../../services/user.js'

const UserPlaylists = () => {
  const [usersPlaylists, setUsersPlaylists] = useState([])

  useEffect(() => {
    const getData = async () => {
      await userService
        .getUsersPlaylists()
        .then(res => {
          setUsersPlaylists(res)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    getData()
  }, [])

  return (
    <>
      <option value>Choose playlist</option>
      {usersPlaylists.map(p => (
        <option key={p.id} value={[p.id, p.name]}>
          {p.name}
        </option>
      ))}
    </>
  )
}

export default UserPlaylists
