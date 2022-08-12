import { useState } from 'react'
import useArtist from '../../context/ArtistContext.js'
import RemoveFromGroup from './RemoveFromGroup'
import UnfollowButton from './UnfollowButton'
import GroupSelection from '../Artists/GroupSelection'
import '../../styles/components/Artists.css'

const SingleArtist = ({ artist }) => {
  const initialState = {
    artistName: artist.name,
    artistSpotifyId: artist.id,
    connectedGroup: '',
  }

  const [itemInput, setItemInput] = useState(initialState)

  const { addArtistToGroup, editArtistGroup } = useArtist()

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
    if (artist.connectedGroupId) {
      editArtistGroup(artist.id, itemInput.connectedGroup)
    } else {
      addArtistToGroup(itemInput)
    }
  }

  return (
    <>
      <div className="single-artist-container">
        <form className="single-artist" onSubmit={addToGroup}>
          <p key={artist.id}>{artist.name}</p>
          <select
            type="text"
            name="connectedGroup"
            onChange={onChange}
            value={itemInput.connectedGroup}>
            <GroupSelection groupName={artist.connectedGroupName} />
          </select>
          <button>{artist.connectedGroupId ? 'Edit' : 'Add'}</button>
        </form>
        {artist.connectedGroupName ? <RemoveFromGroup id={artist.id} /> : null}
        <UnfollowButton id={artist.id} />
      </div>
    </>
  )
}

export default SingleArtist
