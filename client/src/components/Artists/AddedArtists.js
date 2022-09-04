import { useEffect } from 'react'
import SingleArtist from './SingleArtist.js'
import useArtist from '../../context/ArtistContext.js'
import useLoading from '../../hooks/useLoading.js'
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js'

const AddedArtists = () => {
  const { artists, getMoreArtists } = useArtist()
  const { LoadingProgress, triggerLoading } = useLoading()
  const { loadMoreRef, loadMore } = useInfiniteScroll()

  useEffect(() => {
    if (loadMore === false || artists?.length === 0) return
    const action = async () => {
      await getMoreArtists(artists?.length)
      triggerLoading(false)
    }
    triggerLoading(true, 'Getting artists...')
    action()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMore])

  return (
    <>
      <div>
        {artists
          ? artists.map((a, i) => <SingleArtist key={i} artist={a} />)
          : null}
        <LoadingProgress />
        <div ref={loadMoreRef}></div>
      </div>
    </>
  )
}

export default AddedArtists
