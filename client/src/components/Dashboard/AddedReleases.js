import useRelease from '../../context/ReleaseContext'

const AddedReleases = () => {
  const { releases } = useRelease()

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      {releases
        ? releases
            .filter(
              i => i.releaseDate.replace(/-/g, '') >= today.replace(/-/g, ''),
            )
            .map((r, i) => (
              <p key={i}>
                {r.albumName} │ {r.artistName} │ {r.albumType} │ {r.releaseDate}
              </p>
            ))
        : null}
    </>
  )
}

export default AddedReleases
