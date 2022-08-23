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

//context for releases
const ReleaseContext = createContext()

export const ReleaseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(releaseReducer, [])
  const [releases, setReleases] = useState([])
  const { user } = useUser()

  //getting all releases on load
  useEffect(() => {
    const getData = async () => {
      await releaseService
        .getReleasesFromLast30Days(user.userId)
        .then(res => {
          setReleases(res.data)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    getData()
  }, [user.userId])

  //putting them into state
  useEffect(() => {
    dispatch({
      type: 'ALL',
      releases,
    })
  }, [releases])

  //updating releases
  const updateReleases = async () => {
    await releaseService
      .updateDatabaseWithReleases(user.userId)
      .then(res => {
        if (res.data.length !== 0) {
          dispatch({
            type: 'UPDATE',
            data: res.data,
          })
        } else {
          console.log('No new releases')
        }
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const value = {
    releases: state.releases,
    updateReleases,
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
