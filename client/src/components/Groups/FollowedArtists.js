import { useState, useEffect } from 'react'
import artistsService from '../../services/artists.js'
import SingleArtist from './SingleArtist.js'

const FollowedArtists = () => {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    const getData = async () => {
      await artistsService
        .getFollowedArtists()
        .then(res => {
          setArtists(res)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    getData()
  }, [])

  return (
    <>
      <div>
        {artists.map(a => (
          <SingleArtist key={a.id} artist={a} />
        ))}
      </div>
    </>
  )
}

export default FollowedArtists
