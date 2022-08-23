const AlbumsAdded = ({ albums }) => {
  return (
    <>
      <h3>New releases successfully added for:</h3>
      {albums.map(a => (
        <div key={a.albumId}>
          {a.artistName} │ {a.albumName} │
        </div>
      ))}
    </>
  )
}

export default AlbumsAdded
