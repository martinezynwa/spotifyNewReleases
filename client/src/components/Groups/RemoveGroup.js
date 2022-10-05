import { useState } from 'react'
import useGroup from '../../context/GroupContext'
import useUser from '../../context/UserContext'
import useNotification from '../../context/NotificationContext'

const RemoveGroup = ({ id }) => {
  const { removeGroup } = useGroup()
  const { user } = useUser()
  const { setNotification } = useNotification()
  const [buttonText, setButtonText] = useState({
    clicked: 0,
    text: 'Delete group',
  })

  const triggerAction = () => {
    if (buttonText.clicked >= 2) return
    if (buttonText.clicked === 0) {
      setButtonText({
        ...buttonText,
        clicked: buttonText.clicked + 1,
        text: 'Delete?',
      })
    } else {
      user.userId !== process.env.REACT_APP_TEST_USER_ID
        ? removeGroup(id)
        : setNotification({
            message: 'Group was not deleted because this is a demo only',
            style: 'error',
          })

      setButtonText({
        ...buttonText,
        clicked: buttonText.clicked + 1,
        text: 'Deleted',
      })
    }
  }

  return (
    <button
      className="flex bg-active mt-4 w-28 p-2 font-semibold rounded-2xl"
      onClick={() => triggerAction()}>
      <h2 className="mx-auto text-center md:text-base text-xs">
        {buttonText.text}
      </h2>
    </button>
  )
}

export default RemoveGroup
