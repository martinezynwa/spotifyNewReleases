import { useState } from 'react'
import useUser from '../../context/UserContext'
import releaseService from '../../services/releases'
import useNotification from '../../context/NotificationContext'

const CronScheduler = () => {
  const { user } = useUser()
  const [schedule, setSchedule] = useState('')
  const { setNotification } = useNotification()

  const onChange = event => {
    setSchedule(event.target.value)
  }

  const submitChange = async event => {
    if (!schedule) return
    event.preventDefault()
    await releaseService.setScheduler(user.userId, schedule).then(res => {
      setNotification({
        message: `Schedule set`,
        style: 'success',
      })
      setSchedule('')
    })
  }

  return (
    <>
      <form onSubmit={submitChange}>
        <div>
          <label>Schedule</label>
          <input
            type="text"
            name="schedule"
            value={schedule}
            onChange={onChange}
          />
        </div>
        <button>Set</button>
      </form>
    </>
  )
}

export default CronScheduler
