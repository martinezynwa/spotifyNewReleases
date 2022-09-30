import React, { createContext, useContext, useState } from 'react'

//context for notifications
const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const notificationState = {
    message: null,
    style: null,
  }

  const [message, setMessage] = useState(notificationState)

  //show notification for a specific period of time with required style
  //linked to component Notification that handles the displaying
  const setNotification = inputMessage => {
    setMessage({
      ...notificationState,
      message: inputMessage.message,
      style: inputMessage.style,
    })

    //hide notification after some time
    setTimeout(
      () => {
        setMessage('')
      },
      inputMessage.style === 'success' ? 2500 : 10000,
    )
  }

  const value = {
    message,
    setNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

const useNotification = () => {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error('useNotification must be used within NotificationContext')
  }

  return context
}

export default useNotification
