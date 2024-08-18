import BLOG from '#/blog.config';

const Scripts = () => (
  <>
    {BLOG.analytics?.providers?.includes('ackee') && (
      <script
        src={BLOG.analytics.ackeeConfig.tracker}
        data-ackee-server={BLOG.analytics.ackeeConfig.dataAckeeServer}
        data-ackee-domain-id={BLOG.analytics.ackeeConfig.domainId}
      />
    )}
    {BLOG.analytics?.providers?.includes('ga') && (
      <>
        <script
          src={`https://www.googletagmanager.com/gtag/js?id=${BLOG.analytics.gaConfig.measurementId}`}
        />
        <script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${BLOG.analytics.gaConfig.measurementId}', {
            page_path: window.location.pathname,
          });
        `}
        </script>
      </>
    )}
    {BLOG.analytics?.providers?.includes('cnzz') && (
      <script
        src={`https://v1.cnzz.com/z_stat.php?id=${BLOG.analytics.cnzzConfig.id}&web_id=${BLOG.analytics.cnzzConfig.id}`}
      />
    )}
  </>
);

export default Scripts;
