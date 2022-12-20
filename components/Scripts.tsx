import Script from 'next/script'
import BLOG from '@/blog.config'

const Scripts = () => (
  <>
    {BLOG.analytics && BLOG.analytics.providers.includes('ackee') && (
      <Script
        src={BLOG.analytics.ackeeConfig.tracker}
        strategy='afterInteractive'
        data-ackee-server={BLOG.analytics.ackeeConfig.dataAckeeServer}
        data-ackee-domain-id={BLOG.analytics.ackeeConfig.domainId}
      />
    )}
    {BLOG.analytics && BLOG.analytics.providers.includes('ga') && (
      <>
        <Script
          strategy='afterInteractive'
          src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.analytics.gaConfig.measurementId}`}
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${BLOG.analytics.gaConfig.measurementId}', {
            page_path: window.location.pathname,
          });
        `}
        </Script>
      </>
    )}
    {BLOG.analytics && BLOG.analytics.providers.includes('cnzz') && (
      <Script
        strategy='afterInteractive'
        src={`https://v1.cnzz.com/z_stat.php?id=${BLOG.analytics.cnzzConfig.id}&web_id=${BLOG.analytics.cnzzConfig.id}`}
      />
    )}
  </>
)

export default Scripts
