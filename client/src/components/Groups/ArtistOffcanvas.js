import { useState } from 'react'
import useGroup from '../../context/GroupContext'
import Icon from '../../util/Icons'
import useUser from '../../context/UserContext'

const ArtistOffcanvas = () => {
  const {
    groups,
    addArtistToGroup,
    offcanvas,
    toggleOffcanvas,
    artistDetails,
  } = useGroup()
  const { user } = useUser()

  const [buttonText, setButtonText] = useState({
    clicked: 0,
    text: 'Remove from group',
  })

  const manipulateGroup = async (type, newGroup) => {
    await addArtistToGroup({ type, newGroup, _id: artistDetails.artistId })
    toggleOffcanvas(!offcanvas)
  }

  const triggerAction = () => {
    if (buttonText.clicked >= 2) return
    if (buttonText.clicked === 0) {
      setButtonText({
        ...buttonText,
        clicked: buttonText.clicked + 1,
        text: 'Remove?',
      })
    } else {
      if (user.userId !== process.env.REACT_APP_TEST_USER_ID) {
        manipulateGroup('remove')
      } else {
        setButtonText({
          ...buttonText,
          clicked: buttonText.clicked + 1,
          text: 'Removed(demo)',
        })
        setTimeout(() => {
          toggleOffcanvas(!offcanvas)
        }, 2000)
      }
    }
  }

  return (
    <>
      <div className="flex flex-col top-0 right-0 w-full md:w-72 fixed h-screen items-center p-4 bg-album md:text-base text-xl text-center">
        <button
          className="absolute w-6 right-4 md:left-4 top-5 hover:bg-btnhover"
          onClick={() => toggleOffcanvas(!offcanvas)}>
          <Icon name="Exit" size="desktop" />
        </button>
        <h2 className="mb-16 md:mb-4 text-3xl md:text-2xl font-semibold">
          Change group
        </h2>
        <div className="flex flex-col md:gap-0 gap-3">
          {artistDetails.connectedGroupName ? (
            <h2 className="pt-1 pb-1 font-bold md:font-semibold w-64 h-15 bg-active hover:bg-btnhover rounded cursor-pointer">
              {artistDetails.connectedGroupName}
            </h2>
          ) : null}
          {groups
            ? groups
                .filter(g => g.groupName !== artistDetails.connectedGroupName)
                .map(g => (
                  <button
                    className="hover:bg-btnhover w-64 h-8 rounded"
                    onClick={() => {
                      user.userId !== process.env.REACT_APP_TEST_USER_ID
                        ? manipulateGroup('change', {
                            groupId: g._id,
                            groupName: g.groupName,
                          })
                        : toggleOffcanvas(!offcanvas)
                    }}
                    key={g._id}
                    value={[g._id, g.groupName]}>
                    {g.groupName}
                  </button>
                ))
            : null}

          <button
            onClick={() => triggerAction()}
            className={`${
              artistDetails.connectedGroupName === null ? 'hidden ' : null
            } mt-2 font-bold md:font-semibold md:bg-active hover:bg-btnhover  w-64 h-8 rounded`}>
            {buttonText.text}
          </button>
        </div>
      </div>
    </>
  )
}

export default ArtistOffcanvas
