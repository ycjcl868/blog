import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Cnzz = () => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log('window._czc', window._czc)
      window._czc && window._czc.push(['_trackPageview', url])
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return null
}
export default Cnzz
