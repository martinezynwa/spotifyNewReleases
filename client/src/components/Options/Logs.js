import { useState } from 'react'
import userService from '../../services/user'
import logService from '../../services/logs'
import useNotification from '../../context/NotificationContext'

const Logs = () => {
  const [logs, setLogs] = useState([])
  const { setNotification } = useNotification()

  const showLogs = async () => {
    const { id: userId } = await userService.getLoggedUser()

    await logService
      .getLogs(userId)
      .then(res => {
        setLogs(res)
      })
      .catch(err => {
        setNotification({
          message: err.message,
          style: 'error',
        })
      })
  }

  return (
    <>
      <div>Options</div>
      <button
        onClick={logs?.length === 0 ? () => showLogs() : () => setLogs([])}>
        {logs?.length > 0 ? 'Hide logs' : 'Show logs'}
      </button>
      {logs
        ? logs.map((e, i) => (
            <div key={i}>
              {e.timestamp} |{e.statusCode} | {e.message} | {e.action}
            </div>
          ))
        : null}
    </>
  )
}

export default Logs
