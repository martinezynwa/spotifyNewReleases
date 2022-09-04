const AlbumsAdded = ({ albums }) => {
  const returnText =
    albums.length > 0 ? 'New releases successfully added for:' : 'No releases'

  return (
    <>
      <h3>{returnText}</h3>
      {albums.map((a, i) => (
        <div key={i}>
          {a.artistName} │ {a.albumName} │
        </div>
      ))}
    </>
  )
}

export default AlbumsAdded
