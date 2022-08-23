import dayjs from 'dayjs'

const getDay = () => {
  return dayjs().subtract(30, 'day').toISOString().substring(0, 10)
}

export const day30DaysAgo = getDay()
