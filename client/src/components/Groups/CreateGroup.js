import { useState } from 'react'
import UserPlaylists from './UserPlaylists'
import groupService from '../../services/groups.js'

const CreateGroup = () => {
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

  const addGroup = async event => {
    event.preventDefault()

    await groupService.createGroup(itemInput)
  }

  return (
    <>
      <div>
        <h3>Create Group</h3>
        <form onSubmit={addGroup}>
          <div>
            <label>Group name</label>
            <input
              type="text"
              name="groupName"
              value={itemInput.groupName}
              onChange={onChange}
            />
          </div>
          <div className="form-option">
            <label>Connected playlist</label>
            <select
              type="text"
              name="connectedPlaylist"
              onChange={onChange}
              value={itemInput.connectedPlaylist}>
              <UserPlaylists />
            </select>
          </div>
          <button>Create</button>
        </form>
      </div>
    </>
  )
}

export default CreateGroup
