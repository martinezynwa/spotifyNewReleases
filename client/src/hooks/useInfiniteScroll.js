import { useState, useRef, useCallback, useEffect } from 'react'

function useInfiniteScroll() {
  const [loadMore, setLoadMore] = useState(false)
  const loadMoreRef = useRef(null)

  const handleObserver = useCallback(entries => {
    const [target] = entries
    if (target.isIntersecting) {
      setLoadMore(true)
    }
    setTimeout(() => {
      setLoadMore(false)
    }, 100)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver)
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
  }, [handleObserver])

  return { loadMoreRef, loadMore }
}

export default useInfiniteScroll
