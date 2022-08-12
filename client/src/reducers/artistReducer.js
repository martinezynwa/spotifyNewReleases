const artistReducer = (state, action) => {
  switch (action.type) {
    case 'ALL':
      return {
        ...state,
        artists: action.artists,
      }
    case 'UNFOLLOW':
      return {
        ...state,
        artists: state.artists.filter(a => a.id !== action.id),
      }
    case 'ADD_TO_GROUP':
      return {
        ...state,
        artists: state.artists.map(a =>
          a.id === action.data.artistSpotifyId
            ? {
                ...a,
                connectedGroupId: action.data.connectedGroupId,
                connectedGroupName: action.data.connectedGroupName,
              }
            : a,
        ),
      }
    case 'REMOVE_FROM_GROUP':
      return {
        ...state,
        artists: state.artists.map(a =>
          a.id === action.id
            ? {
                ...a,
                connectedGroupId: null,
                connectedGroupName: null,
              }
            : a,
        ),
      }
    default:
      return state
  }
}

export default artistReducer
