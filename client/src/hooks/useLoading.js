import { useState } from 'react'
import Spinner from '../util/Spinner'

const useLoading = () => {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const LoadingProgress = () => {
    if (!loading) return null
    return (
      <div className="flex flex-row items-center gap-2 ml-3 mb-4 font-semibold text-base md:text-lg">
        <Spinner />
        {loadingText}
      </div>
    )
  }

  const triggerLoading = (value, text) => {
    setLoadingText(value === false ? '' : text)
    setLoading(value)
  }

  return {
    loading,
    triggerLoading,
    LoadingProgress,
  }
}

export default useLoading
