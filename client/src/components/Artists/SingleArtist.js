import { useState } from 'react'
import useArtist from '../../context/ArtistContext.js'
import GroupSelection from '../Artists/GroupSelection'

const SingleArtist = ({ artist }) => {
  const initialState = {
    _id: artist._id,
    connectedGroup: '',
  }

  const [itemInput, setItemInput] = useState(initialState)

  const { addArtistToGroup } = useArtist()

  const onChange = event => {
    setItemInput({
      ...itemInput,
      [event.target.name]: event.target.value,
    })
  }

  const addToGroup = async event => {
    event.preventDefault()
    if (!itemInput.connectedGroup) {
      return console.log('Nothing set')
    }
    await addArtistToGroup(itemInput)
  }

  return (
    <>
      <div>
        <form onSubmit={addToGroup}>
          <p>{artist.artistName}</p>
          <select
            type="text"
            name="connectedGroup"
            onChange={onChange}
            value={itemInput.connectedGroup}>
            <GroupSelection groupName={artist.connectedGroupName} />
          </select>
          <button>{artist.connectedGroupId ? 'Edit' : 'Add'}</button>
        </form>
      </div>
    </>
  )
}

export default SingleArtist
