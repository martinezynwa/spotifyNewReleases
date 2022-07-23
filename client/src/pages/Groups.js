import { useState, useEffect } from 'react'
import artistsService from '../services/artists.js'

const Groups = () => {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    const getData = async () => {
      await artistsService.getFollowedArtists().then(res => {
        setArtists(res)
      })
    }
    getData()
  }, [])

  return (
    <>
      <div>
        <h1>Followed Artists</h1>
        {artists.map(a => (
          <p key={a.id}>
            {a.name} {a.id}
          </p>
        ))}
      </div>
    </>
  )
}

export default Groups
