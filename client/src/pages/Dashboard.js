import { useState, useEffect } from 'react'
import artistsService from '../services/artists.js'

const Dashboard = () => {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    const getData = async () => {
      await artistsService.getArtistsAlbums().then(res => {
        setAlbums(res)
      })
    }
    getData()
  }, [])
  console.log('albums', albums)
  return (
    <>
      <div>
        <h1>Followed Artists</h1>
        {/*        {albums.map(a => (
          <p key={a.id}>
            {a.name} {a.id}
          </p>
        ))}*/}
      </div>
    </>
  )
}

export default Dashboard
