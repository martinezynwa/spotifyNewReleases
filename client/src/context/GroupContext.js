import React, {
  useReducer,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'
import groupService from '../services/groups'
import groupReducer from '../reducers/groupReducer'
import useUser from '../context/UserContext'

//context for groups
const GroupContext = createContext()

export const GroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(groupReducer, [])
  const [groups, setGroups] = useState([])
  const { user } = useUser()

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

  //putting them into state
  useEffect(() => {
    dispatch({
      type: 'ALL',
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
          type: 'ADD',
          data: { newGroup: res },
        })
        console.log(res.groupName)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  //removing group
  const removeGroup = async id => {
    await groupService
      .removeGroup(id)
      .then(res => {
        dispatch({
          type: 'REMOVE',
          data: id,
        })
        console.log(res)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  const value = {
    groups: state.groups,
    addGroup,
    removeGroup,
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
