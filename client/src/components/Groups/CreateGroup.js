import { useState } from 'react'
import UserPlaylists from './UserPlaylists'
import useGroup from '../../context/GroupContext'

const CreateGroup = () => {
  const { addGroup } = useGroup()
  const initialState = {
    groupName: '',
    connectedPlaylist: '',
  }

  const [itemInput, setItemInput] = useState(initialState)

  const onChange = event => {
    setItemInput({
      ...itemInput,
      [event.target.name]: event.target.value,
    })
  }

  const submitGroup = event => {
    event.preventDefault()
    addGroup(itemInput)
    setItemInput(initialState)
  }

  return (
    <>
      <div>
        <form onSubmit={submitGroup}>
          <div>
            <select
              className="bg-active py-2 mb-2 text-gray-400 rounded w-[18rem]"
              placeholder="Select playlist"
              type="text"
              name="connectedPlaylist"
              onChange={onChange}
              value={itemInput.connectedPlaylist}>
              <UserPlaylists />
            </select>
          </div>
          <div className="">
            <input
              className="bg-active pl-1 py-2 mb-3 text-gray-300 rounded w-[18rem]"
              placeholder="Enter group name"
              type="text"
              name="groupName"
              value={itemInput.groupName}
              onChange={onChange}
            />
          </div>
          <button className='p-2 w-20 h-11 bg-active font-semibold rounded-2xl hover:bg-active'>Create</button>
        </form>
      </div>
    </>
  )
}

export default CreateGroup
