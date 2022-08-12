const AlbumsAdded = ({ albums }) => {
  return (
    <>
      <h3>New releases successfully added for:</h3>
      {albums.map(a => (
        <div key={a.album_id}>
          {a.artist_name} │ {a.release_type} │ {a.album_name} │ {a.release_date}
        </div>
      ))}
    </>
  )
}

export default AlbumsAdded
