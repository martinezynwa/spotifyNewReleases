import { useEffect, useState } from 'react'
import '../../styles/components/Artists.css'
import AllGroups from './AllGroups'
import artistService from '../../services/artists.js'
import groupService from '../../services/groups.js'
import RemoveFromGroup from './RemoveFromGroup'

const SingleArtist = ({ artist }) => {
  const initialState = {
    artistName: artist.name,
    artistSpotifyId: artist.id,
    connectedGroup: '',
  }

  const [itemInput, setItemInput] = useState(initialState)
  const [artistInGroup, setArtistInGroup] = useState()

  useEffect(() => {
    const getData = async () => {
      await groupService
        .checkIfArtistIsInGroup(artist.id)
        .then(res => {
          res
            ? setArtistInGroup({
                _id: res._id,
                connectedGroupName: res.connectedGroupName,
              })
            : setArtistInGroup('notAdded')
        })
        .catch(err => {
          console.log(err.message)
        })
    }
    getData()
  }, [])

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
    if (artistInGroup !== 'notAdded') {
      await artistService.editArtistGroup(
        artistInGroup._id,
        itemInput.connectedGroup,
      )
    } else {
      await artistService.addArtistToGroup(itemInput)
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
            <AllGroups alreadyAdded={artistInGroup} list={true} />
          </select>
          <button>{artistInGroup !== 'notAdded' ? 'Edit' : 'Add'}</button>
        </form>
        {artistInGroup ? <RemoveFromGroup id={artist.id} /> : null}
      </div>
    </>
  )
}

export default SingleArtist
