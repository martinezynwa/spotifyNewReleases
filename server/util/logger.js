import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import dayjs from 'dayjs'

const Log = require('../models/Log.cjs')

const addLogToDatabase = async log => {
  const newLog = new Log({
    username: log.username,
    timestamp: dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
    action: log.action,
    message: log.message,
    statusCode: log.status,
    errorUrl: log.baseUrl && log.url ? `${log.baseUrl}${log.url}` : '',
  })

  await newLog.save()
}

export default {
  addLogToDatabase,
}
