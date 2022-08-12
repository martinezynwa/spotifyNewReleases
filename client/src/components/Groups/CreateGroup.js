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
        <h3>Create Group</h3>
        <form onSubmit={submitGroup}>
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
