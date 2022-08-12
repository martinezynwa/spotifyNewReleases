const groupReducer = (state, action) => {
  switch (action.type) {
    case 'ALL':
      return {
        ...state,
        groups: action.groups,
      }
    case 'ADD':
      return { groups: [...state.groups, action.data.newGroup] }
    case 'REMOVE':
      const filteredArray = state.groups.filter(g => g._id !== action.data)
      return {
        ...state,
        groups: filteredArray,
      }
    default:
      return state
  }
}

export default groupReducer
