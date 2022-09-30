import { useEffect, useMemo } from 'react'
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
        <h2 className="ml-1 md:ml-0 mb-10 text-3xl text-white font-semibold tracking-tight">
          Released albums in last 60 days
        </h2>
        <UpdateButton />
        <div className="grid grid-cols-1 gap-0 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {releases
            ? releases.map((r, i) => <SingleRelease key={i} artist={r} />)
            : null}
        </div>
        <LoadingProgress />
        <div ref={loadMoreRef}></div>
      </div>
    </>
  )
}

export default ReleasesList
