import React, {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import releaseService from '../services/releases'
import releaseReducer from '../reducers/releaseReducer'
import useUser from '../context/UserContext'
import useNotification from '../context/NotificationContext'

//context for releases
const ReleaseContext = createContext()

export const ReleaseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(releaseReducer, [])
  const [releases, setReleases] = useState([])
  const { user } = useUser()
  const { setNotification } = useNotification()

  //getting all releases on load
  useEffect(() => {
    const getData = async () => {
      await releaseService
        .getReleasesFromLast60Days(user.userId)
        .then(res => {
          setReleases(res)
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

  //putting them into state
  useEffect(() => {
    dispatch({
      type: 'ALL',
      releases,
    })
  }, [releases])

  //get more releases(infinite scrolling)
  const getMoreReleases = async skip => {
    await releaseService
      .getReleasesFromLast60Days(user.userId, skip)
      .then(res => {
        dispatch({
          type: 'ADD_RELEASES',
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

  //updating releases
  const updateReleases = async () => {
    await releaseService
      .updateDatabaseWithReleases(user.userId)
      .then(res => {
        if (res.length !== 0) {
          dispatch({
            type: 'UPDATE',
            data: res,
          })
          setNotification({
            message: `${res.length} releases added`,
            style: 'success',
          })
        } else {
          setNotification({
            message: 'No new releases found',
            style: 'success',
          })
        }
      })
      .catch(err => {
        setNotification({
          message: `${err.response.status}, ${err.response.data}`,
          style: 'error',
        })
      })
  }

  const value = {
    releases: state.releases,
    updateReleases,
    getMoreReleases,
  }

  return (
    <ReleaseContext.Provider value={value}>{children}</ReleaseContext.Provider>
  )
}

const useRelease = () => {
  const context = useContext(ReleaseContext)

  if (context === undefined) {
    throw new Error('useRelease must be used within ReleaseContext')
  }

  return context
}

export default useRelease
