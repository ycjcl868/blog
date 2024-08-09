import BLOG from '#/blog.config'
import { useEffect, lazy, Suspense } from 'react'
import { ClientOnly } from '~/components/ClientOnly'
import { useTheme } from 'remix-theme'
import { ReactCusdis } from 'react-cusdis'
import { useLocation } from '@remix-run/react'

const GitalkComponent = lazy(() => {
  return import('~/components/Gitalk')
})
const UtterancesComponent = lazy(() => {
  return import('~/components/Utterances')
})

const Comments = ({ frontMatter }) => {
  const location = useLocation()
  const { theme } = useTheme()

  const cusdisTheme = theme === 'dark' ? 'dark' : 'light'

  useEffect(() => {
    if (typeof window !== 'undefined' && window.CUSDIS) {
      window.CUSDIS.setTheme(cusdisTheme)
    }
  }, [cusdisTheme])

  return (
    <div>
      {BLOG.comment && BLOG.comment.provider === 'gitalk' && (
        <Suspense fallback=''>
          <GitalkComponent
            options={{
              id: frontMatter.id,
              title: frontMatter.title,
              clientID: BLOG.comment.gitalkConfig.clientID,
              clientSecret: BLOG.comment.gitalkConfig.clientSecret,
              repo: BLOG.comment.gitalkConfig.repo,
              owner: BLOG.comment.gitalkConfig.owner,
              admin: BLOG.comment.gitalkConfig.admin,
              distractionFreeMode:
                BLOG.comment.gitalkConfig.distractionFreeMode,
              proxy: BLOG.comment.gitalkConfig.proxy
            }}
          />
        </Suspense>
      )}
      {BLOG.comment && BLOG.comment.provider === 'utterances' && (
        <UtterancesComponent issueTerm={frontMatter.id} />
      )}
      {BLOG.comment && BLOG.comment.provider === 'cusdis' && (
        <Suspense fallback=''>
          <ReactCusdis
            lang='zh-cn'
            attrs={{
              host: BLOG.comment.cusdisConfig.host,
              appId: BLOG.comment.cusdisConfig.appId,
              pageId: frontMatter.id,
              pageTitle: frontMatter.title,
              pageUrl: BLOG.link + location.pathname,
              theme: 'auto'
            }}
          />
        </Suspense>
      )}
    </div>
  )
}

export default Comments
