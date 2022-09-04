const artistReducer = (state, action) => {
  switch (action.type) {
    case 'ALL_ARTISTS':
      return {
        ...state,
        artists: action.artists,
      }
    case 'ALL_GROUPS':
      return {
        ...state,
        groups: action.groups,
      }
    case 'ADD_ARTISTS':
      return {
        ...state.artists,
        artists: state.artists.concat(action.data),
      }
    case 'SYNC':
      return {
        ...state.artists,
        artists: state.artists.concat(action.data).sort((a, b) => {
          b = b.connectedGroupName || ''
          a = a.connectedGroupName || ''
          return a.localeCompare(b)
        }),
      }
    case 'REMOVE_UNFOLLOWED':
      return {
        ...state.artists,
        artists: state.artists.filter(artist => {
          return !action.data.find(state => {
            return state.artistSpotifyId === artist.artistSpotifyId
          })
        }),
      }
    default:
      return state
  }
}

export default artistReducer
