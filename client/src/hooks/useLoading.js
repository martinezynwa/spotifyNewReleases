import { useState } from 'react'
import Spinner from '../util/Spinner'

const useLoading = () => {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const LoadingProgress = () => {
    if (!loading) return null
    return (
      <div className="flex flex-row gap-2 ml-3 mb-4 font-semibold text-lg">
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
