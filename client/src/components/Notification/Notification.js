import useNotification from '../../context/NotificationContext'

const Notification = () => {
  const { message } = useNotification()
  return (
    <>
      <div
        className={`absolute top-0 md:top-4 md:right-5 w-[100%] md:w-auto h-20 md:h-0 text-center md:text-start md:px-4 md:py-6 ${
          message.style ? ' ' : 'hidden '
        }{${
          message.style === 'success' ? ' bg-green-500 ' : ' bg-red-500 '
        } md:rounded-lg font-semibold`}>
        <h2 className='my-7 md:-my-3'>{message.message}</h2>
      </div>
    </>
  )
}

export default Notification
