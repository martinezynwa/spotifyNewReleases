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
import useNotification from '../context/NotificationContext'

//context for artists
const ArtistContext = createContext()

export const ArtistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(artistReducer, [])
  const [artists, setArtists] = useState([])
  const [groups, setGroups] = useState([])
  const { user } = useUser()
  const { setNotification } = useNotification()

  //getting all followed artists from database on load
  useEffect(() => {
    const getData = async () => {
      await artistService
        .getArtistsFromDatabase(user.userId)
        .then(res => {
          setArtists(res)
        })
        .catch(err => {
          setNotification({
            message: err.message,
            style: 'error',
          })
        })
    }

    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setNotification({
            message: err.message,
            style: 'error',
          })
        })
    }

    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userId])

  //putting groups into state
  useEffect(() => {
    dispatch({
      type: 'ALL_GROUPS',
      groups,
    })
  }, [groups])

  //get more artists(infinite scrolling)
  const getMoreArtists = async skip => {
    await artistService
      .getArtistsFromDatabase(user.userId, skip)
      .then(res => {
        dispatch({
          type: 'ADD_ARTISTS',
          data: res,
        })
      })
      .catch(err => {
        setNotification({
          message: err.message,
          style: 'error',
        })
      })
  }

  //sync followed artists from Spotify with database
  const syncFollowedArtists = async () => {
    await spotifyService
      .syncFollowedArtists(user.userId)
      .then(res => {
        if (res.length === 0) {
          setNotification({
            message: 'No difference',
            style: 'success',
          })
          return
        }
        dispatch({
          type: 'SYNC',
          data: res,
        })
        setNotification({
          message: `${res.length} new found`,
          style: 'success',
        })
      })
      .catch(err => {
        setNotification({
          message: `${err.response.status}, ${err.response.data}`,
          style: 'error',
        })
      })
  }

  //remove unfollowed artists
  const removeUnfollowed = async () => {
    await spotifyService
      .removeUnfollowed(user.userId)
      .then(res => {
        if (res.length === 0) {
          setNotification({
            message: 'No difference',
            style: 'success',
          })
          return
        }
        dispatch({
          type: 'REMOVE_UNFOLLOWED',
          data: res,
        })
        setNotification({
          message: `Removed: ${res.length} artists`,
          style: 'success',
        })
      })
      .catch(err => {
        setNotification({
          message: `${err.response.status}, ${err.response.data}`,
          style: 'error',
        })
      })
  }

  //adding artist to group
  const addArtistToGroup = async artist => {
    await artistService
      .addArtistToGroup(artist)
      .then(res => {
        console.log('res', res)
        setNotification({
          message: res === 'Removed' ? res : `Added to: ${res}`,
          style: 'success',
        })
      })
      .catch(err => {
        setNotification({
          message: `${err.response.status}, ${err.response.data}`,
          style: 'error',
        })
      })
  }

  const value = {
    artists: state.artists,
    groups: state.groups,
    getMoreArtists,
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
