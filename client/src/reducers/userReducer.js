const userReducer = (state, action) => {
  switch (action.type) {
    case 'USER':
      return {
        ...state,
        user: action.user,
      }
    default:
      return state
  }
}

export default userReducer
