import useNotification from '../../context/NotificationContext'

const Notification = () => {
  const { message } = useNotification()

  return (
    <>
      <div className={message.style}>{message.message}</div>
    </>
  )
}

export default Notification
