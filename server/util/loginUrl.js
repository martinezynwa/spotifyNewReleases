import dotenv from 'dotenv'
dotenv.config()

const scopes = [
  'user-follow-read',
  'user-follow-modify',
  'playlist-read-private',
  'playlist-modify-private',
]

export const loginUrl = `https://accounts.spotify.com/authorize?client_id=${
  process.env.CLIENT_ID
}&response_type=code&redirect_uri=${
  process.env.REDIRECT_URI
}&scope=${scopes.join('%20')}`
