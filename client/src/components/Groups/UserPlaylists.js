import { useState, useEffect } from 'react'
import userService from '../../services/user.js'
import useUser from '../../context/UserContext'

const UserPlaylists = () => {
  const { user } = useUser()
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
  }, [user])

  return (
    <>
      <option value>Choose playlist</option>
      {usersPlaylists.map((p, i) => (
        <option key={i} value={[p.id, p.name]}>
          {p.name}
        </option>
      ))}
    </>
  )
}

export default UserPlaylists
