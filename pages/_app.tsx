import { useEffect } from 'react'
import Router from 'next/router'
import { Analytics } from '@vercel/analytics/react'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import 'prismjs'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.min.css'
import '@/styles/globals.css'
import '@/styles/notion.css'
import '@/styles/gitalk.css'
import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { ThemeProvider } from 'next-themes'
import { LocaleProvider } from '@/lib/locale'
import Scripts from '@/components/Scripts'

const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })
const Cnzz = dynamic(() => import('@/components/Cnzz'), { ssr: false })

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    Router.events.on('routeChangeStart', handleRouteStart)
    Router.events.on('routeChangeComplete', handleRouteDone)
    Router.events.on('routeChangeError', handleRouteDone)

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off('routeChangeStart', handleRouteStart)
      Router.events.off('routeChangeComplete', handleRouteDone)
      Router.events.off('routeChangeError', handleRouteDone)
    }
  }, [])

  return (
    <>
      <Scripts />
      <LocaleProvider>
        <>
          {BLOG.isProd && BLOG?.analytics?.providers.includes('ackee') && (
            <Ackee
              ackeeServerUrl={BLOG.analytics.ackeeConfig.dataAckeeServer}
              ackeeDomainId={BLOG.analytics.ackeeConfig.domainId}
            />
          )}
          {BLOG.isProd && BLOG?.analytics?.providers.includes('ga') && <Gtag />}
          {BLOG.isProd && BLOG?.analytics?.providers.includes('cnzz') && (
            <Cnzz />
          )}

          <ThemeProvider attribute='class'>
            <Component {...pageProps} />
          </ThemeProvider>
        </>
      </LocaleProvider>
      <Analytics />
    </>
  )
}

export default MyApp
