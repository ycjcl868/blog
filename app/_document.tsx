import { Links, Meta, Scripts, ScrollRestoration, LiveReload } from 'remix'
// import { IconContext } from 'react-icons'
import BLOG from '../blog.config'
import CJK from '~/lib/cjk'

interface DocumentProps {
  title?: string
}

const Document: React.FC<DocumentProps> = ({ children, title }) => {
  return (
    <html lang={BLOG.lang}>
      <head>
        <meta charSet='utf-8' />
        <Meta />
        <Links />
        {title ? <title>{title}</title> : null}
        {BLOG.font && BLOG.font === 'serif' ? (
          <>
            <link
              rel='preload'
              href='//cdn.jsdelivr.net/gh/ycjcl868/blog@1.0.0/public/fonts/SourceSerif.var.woff2'
              as='font'
              type='font/woff2'
              crossOrigin='anonymous'
            />
            <link
              rel='preload'
              href='//cdn.jsdelivr.net/gh/ycjcl868/blog@1.0.0/public/fonts/SourceSerif-Italic.var.woff2'
              as='font'
              type='font/woff2'
              crossOrigin='anonymous'
            />
          </>
        ) : (
          <>
            <link
              rel='preload'
              href='//cdn.jsdelivr.net/gh/ycjcl868/blog@1.0.0/public/fonts/IBMPlexSansVar-Roman.woff2'
              as='font'
              type='font/woff2'
              crossOrigin='anonymous'
            />
            <link
              rel='preload'
              href='//cdn.jsdelivr.net/gh/ycjcl868/blog@1.0.0/public/fonts/IBMPlexSansVar-Italic.woff2'
              as='font'
              type='font/woff2'
              crossOrigin='anonymous'
            />
          </>
        )}

        {['zh', 'ja', 'ko'].includes(
          BLOG.lang.slice(0, 2).toLocaleLowerCase()
        ) && (
          <>
            <link
              rel='preconnect'
              href='https://fonts.gstatic.com'
              crossOrigin='anonymous'
            />
            <link
              rel='preload preconnect'
              as='style'
              href={`https://fonts.loli.net/css2?family=Noto+${
                BLOG.font === 'serif' ? 'Serif' : 'Sans'
              }+${CJK()}:wght@400;500;700&display=swap`}
            />
            <link
              rel='stylesheet preconnect prefetch'
              href={`https://fonts.loli.net/css2?family=Noto+${
                BLOG.font === 'serif' ? 'Serif' : 'Sans'
              }+${CJK()}:wght@400;500;700&display=swap`}
            />
            <noscript>
              <link
                rel='stylesheet preconnect prefetch'
                href={`https://fonts.loli.net/css2?family=Noto+${
                  BLOG.font === 'serif' ? 'Serif' : 'Sans'
                }+${CJK()}:wght@400;500;700&display=swap`}
              />
            </noscript>
          </>
        )}
        <link rel='icon' href='/favicon.png' />
        <link
          rel='apple-touch-icon'
          sizes='192x192'
          href='/apple-touch-icon.png'
        ></link>
        <link
          rel='alternate'
          type='application/rss+xml'
          title='RSS 2.0'
          href='/feed'
        ></link>
        {BLOG.appearance === 'auto' ? (
          <>
            <meta
              name='theme-color'
              content={BLOG.lightBackground}
              media='(prefers-color-scheme: light)'
            />
            <meta
              name='theme-color'
              content={BLOG.darkBackground}
              media='(prefers-color-scheme: dark)'
            />
          </>
        ) : (
          <meta
            name='theme-color'
            content={
              BLOG.appearance === 'dark'
                ? BLOG.darkBackground
                : BLOG.lightBackground
            }
          />
        )}
      </head>
      <body className='bg-day dark:bg-night'>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

export default Document
