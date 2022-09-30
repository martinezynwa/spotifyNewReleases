import React, {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import groupService from '../services/groups'
import artistService from '../services/artists'
import groupReducer from '../reducers/groupReducer'
import useUser from '../context/UserContext'
import useNotification from '../context/NotificationContext'

//context for groups
const GroupContext = createContext()

export const GroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(groupReducer, [])
  const [groups, setGroups] = useState([])
  const [offcanvas, setShowOffcanvas] = useState(false)
  const { user } = useUser()
  const { setNotification } = useNotification()
  const [artistDetails, setArtistDetails] = useState({})

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

  //putting all groups into state
  useEffect(() => {
    dispatch({
      type: 'ALL_GROUPS',
      groups,
    })
  }, [groups])

  //adding new group
  const addGroup = async newGroup => {
    const obj = {
      newGroup,
      userId: user.userId,
    }
    await groupService
      .createGroup(obj)
      .then(res => {
        dispatch({
          type: 'ADD_GROUP',
          data: { newGroup: res },
        })
        setNotification({
          message: `Group ${res.groupName} created`,
          style: 'success',
        })
      })
      .catch(err => {
        setNotification({
          message: err.message,
          style: 'error',
        })
      })
  }

  //removing group
  const removeGroup = async id => {
    await groupService
      .removeGroup(id)
      .then(res => {
        dispatch({
          type: 'REMOVE_GROUP',
          data: id,
        })
        setNotification({
          message: 'Group removed',
          style: 'success',
        })
      })
      .catch(err => {
        setNotification({
          message: err.message,
          style: 'error',
        })
      })
  }

  //get artists from specified group
  const getArtists = async groupId => {
    await artistService
      .getArtistsFromGroups(groupId, user.userId)
      .then(res => {
        dispatch({
          type: 'GET_ARTISTS',
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

  //manipulating artist's group
  const addArtistToGroup = async data => {
    await artistService
      .manipulateArtistGroup(data)
      .then(res => {
        dispatch({
          type: 'MANIPULATE_ARTIST_GROUP',
          data: data._id,
        })

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

  //show offcanvas when manipulating group
  const toggleOffcanvas = () => {
    setShowOffcanvas(!offcanvas)
  }

  //get group & artist details when passing info to the sidebar during editation
  const toggleGroupDetails = artistDetails => {
    setArtistDetails(artistDetails)
  }

  const value = {
    groups: state.groups,
    artists: state.artists,
    offcanvas,
    artistDetails,
    addGroup,
    removeGroup,
    getArtists,
    addArtistToGroup,
    toggleOffcanvas,
    toggleGroupDetails,
  }
  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}

const useGroup = () => {
  const context = useContext(GroupContext)

  if (context === undefined) {
    throw new Error('useGroup must be used within GroupContext')
  }

  return context
}

export default useGroup
