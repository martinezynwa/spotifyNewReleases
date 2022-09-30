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
      <div className="flex flex-row justify-between mt-5 items-center gap-8">
        <p>App logs</p>
        <button
          className="bg-active hover:bg-btnhover p-2 w-[74px] h-15 rounded-lg cursor-pointer"
          onClick={logs?.length === 0 ? () => showLogs() : () => setLogs([])}>
          {logs?.length > 0 ? 'Hide' : 'Show'}
        </button>
      </div>
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
