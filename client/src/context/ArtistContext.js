import React, {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import spotifyService from '../services/spotify'
import artistService from '../services/artists'
import artistReducer from '../reducers/artistReducer'
import userService from '../services/user'

//context for artists
const ArtistContext = createContext()

export const ArtistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(artistReducer, [])

  const [artists, setArtists] = useState([])

  //getting all followed artists on load
  useEffect(() => {
    const getData = async () => {
      await spotifyService
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

  //putting them into state
  useEffect(() => {
    dispatch({
      type: 'ALL',
      artists,
    })
  }, [artists])

  //adding artist to group
  const addArtistToGroup = async artist => {
    const { id: userId } = await userService.getLoggedUser()
    const obj = {
      artist,
      userId,
    }
    await artistService
      .addArtistToGroup(obj)
      .then(res => {
        dispatch({
          type: 'ADD_TO_GROUP',
          data: res.data,
        })
        console.log('res', res.data.connectedGroupName)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  //editing artist's gorup
  const editArtistGroup = async (id, connectedGroup) => {
    await artistService
      .editArtistGroup(id, connectedGroup)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  //removing artist's group
  const removeArtistFromGroup = async id => {
    await artistService
      .removeArtistFromGroup(id)
      .then(res => {
        dispatch({
          type: 'REMOVE_FROM_GROUP',
          id,
        })
        console.log('Removed from group')
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  //unfollowing artist
  const unfollowArtist = async (id, accessToken) => {
    await spotifyService
      .unfollowArtist({ id, accessToken })
      .then(res => {
        dispatch({
          type: 'UNFOLLOW',
          id,
        })
        console.log('Artist unfollowed')
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const value = {
    artists: state.artists,
    addArtistToGroup,
    editArtistGroup,
    removeArtistFromGroup,
    unfollowArtist,
  }
  return (
    <ArtistContext.Provider value={value}>{children}</ArtistContext.Provider>
  )
}

const useArtist = () => {
  const context = useContext(ArtistContext)

  if (context === undefined) {
    throw new Error('useArtist must be used within ArtistContext')
  }

  return context
}

export default useArtist
