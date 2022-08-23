const releaseReducer = (state, action) => {
  switch (action.type) {
    case 'ALL':
      return {
        ...state,
        releases: action.releases.sort(
          //sorting by date + time, newest on top
          (a, b) =>
            b.releaseDate.replaceAll(/[-T:]/g, '') -
            a.releaseDate.replaceAll(/[-T:]/g, ''),
        ),
      }
    case 'UPDATE':
      return {
        ...state,
        releases: state.releases.concat(action.data).sort(
          //sorting by date + time, newest on top
          (a, b) =>
            b.releaseDate.replaceAll(/[-T:]/g, '') -
            a.releaseDate.replaceAll(/[-T:]/g, ''),
        ),
      }
    default:
      return state
  }
}

export default releaseReducer
