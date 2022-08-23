import React, {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import groupService from '../services/groups'
import spotifyService from '../services/spotify'
import artistService from '../services/artists'
import artistReducer from '../reducers/artistReducer'
import useUser from '../context/UserContext'

//context for artists
const ArtistContext = createContext()

export const ArtistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(artistReducer, [])
  const [artists, setArtists] = useState([])
  const [groups, setGroups] = useState([])
  const { user } = useUser()

  //getting all followed artists from database on load
  useEffect(() => {
    const getData = async () => {
      await artistService
        .getArtistsFromDatabase(user.userId)
        .then(res => {
          setArtists(res)
        })
        .catch(err => {
          console.log(err.message)
        })
    }

    getData()
  }, [user.userId])

  //putting artists into state
  useEffect(() => {
    dispatch({
      type: 'ALL_ARTISTS',
      artists,
    })
  }, [artists])

  //getting all groups on load
  useEffect(() => {
    const getData = async () => {
      await groupService
        .getGroups(user.userId)
        .then(res => {
          setGroups(res)
        })
        .catch(err => {
          console.log(err.message)
        })
    }

    getData()
  }, [user.userId])

  //putting groups into state
  useEffect(() => {
    dispatch({
      type: 'ALL_GROUPS',
      groups,
    })
  }, [groups])

  //sync followed artists from Spotify with database
  const syncFollowedArtists = async () => {
    await spotifyService
      .syncFollowedArtists(user.userId)
      .then(res => {
        if (res.length !== 0) {
          dispatch({
            type: 'SYNC',
            data: res,
          })
        } else {
          console.log('No new artists followed')
        }
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  //remove unfollowed artists
  const removeUnfollowed = async () => {
    await spotifyService
      .removeUnfollowed(user.userId)
      .then(res => {
        if (res.length !== 0) {
          dispatch({
            type: 'REMOVE_UNFOLLOWED',
            data: res,
          })
        } else {
          console.log('No difference')
        }
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  //adding artist to group
  const addArtistToGroup = async artist => {
    await artistService
      .addArtistToGroup(artist)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const value = {
    artists: state.artists,
    groups: state.groups,
    addArtistToGroup,
    syncFollowedArtists,
    removeUnfollowed,
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
