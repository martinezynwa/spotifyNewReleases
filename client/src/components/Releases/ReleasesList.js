import { useEffect } from 'react'
import UpdateButton from './UpdateButton.js'
import SingleRelease from './SingleRelease.js'
import useRelease from '../../context/ReleaseContext'
import useLoading from '../../hooks/useLoading.js'
import useInfiniteScroll from '../../hooks/useInfiniteScroll.js'

const ReleasesList = () => {
  const { releases, getMoreReleases } = useRelease()
  const { LoadingProgress, triggerLoading } = useLoading()
  const { loadMoreRef, loadMore } = useInfiniteScroll()

  useEffect(() => {
    if (loadMore === false || releases?.length === 0) return
    const action = async () => {
      await getMoreReleases(releases?.length)
      triggerLoading(false)
    }
    triggerLoading(true, 'Getting releases...')
    action()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMore])

  return (
    <>
      <div>
        <UpdateButton />
        {releases
          ? releases.map((r, i) => <SingleRelease key={i} artist={r} />)
          : null}
        <LoadingProgress />
        <div ref={loadMoreRef}></div>
      </div>
    </>
  )
}

export default ReleasesList
