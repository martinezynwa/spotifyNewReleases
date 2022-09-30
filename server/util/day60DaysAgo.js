import dayjs from 'dayjs'

const getDay = () => {
  return dayjs().subtract(60, 'day').toISOString().substring(0, 10)
}

export const day60DaysAgo = getDay()
