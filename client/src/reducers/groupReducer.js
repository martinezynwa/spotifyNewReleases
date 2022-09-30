const groupReducer = (state, action) => {
  switch (action.type) {
    case 'ALL_GROUPS':
      return {
        ...state,
        groups: action.groups,
      }
    case 'ADD_GROUP':
      return { groups: [...state.groups, action.data.newGroup] }
    case 'REMOVE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(g => g._id !== action.data),
      }
    case 'GET_ARTISTS':
      return { ...state, artists: action.data }
    case 'MANIPULATE_ARTIST_GROUP':
      return {
        ...state,
        artists: state.artists.filter(a => a._id !== action.data),
      }
    default:
      return state
  }
}

export default groupReducer
