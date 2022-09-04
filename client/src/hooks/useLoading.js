import { useState } from 'react'

const useLoading = () => {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const LoadingProgress = () => {
    if (!loading) return null
    return <div>{loadingText}</div>
  }

  const triggerLoading = (value, text) => {
    setLoadingText(value === false ? '' : text)
    setLoading(value)
  }

  return {
    triggerLoading,
    LoadingProgress,
  }
}

export default useLoading
