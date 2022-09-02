import { fetchCusdisLang } from '@/lib/cusdisLang'
import BLOG from '@/blog.config'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const GitalkComponent = dynamic(
  () => {
    return import('gitalk/dist/gitalk-component')
  },
  { ssr: false }
)
const UtterancesComponent = dynamic(
  () => {
    return import('@/components/Utterances')
  },
  { ssr: false }
)
const CusdisComponent = dynamic(
  (): any => {
    return import('react-cusdis').then((m) => m.ReactCusdis)
  },
  { ssr: false }
)

const Comments = ({ frontMatter }) => {
  const router = useRouter()
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
        <GitalkComponent
          options={{
            id: frontMatter.id,
            title: frontMatter.title,
            clientID: BLOG.comment.gitalkConfig.clientID,
            clientSecret: BLOG.comment.gitalkConfig.clientSecret,
            repo: BLOG.comment.gitalkConfig.repo,
            owner: BLOG.comment.gitalkConfig.owner,
            admin: BLOG.comment.gitalkConfig.admin,
            distractionFreeMode: BLOG.comment.gitalkConfig.distractionFreeMode,
            proxy: BLOG.comment.gitalkConfig.proxy
          }}
        />
      )}
      {BLOG.comment && BLOG.comment.provider === 'utterances' && (
        <UtterancesComponent issueTerm={frontMatter.id} />
      )}
      {BLOG.comment && BLOG.comment.provider === 'cusdis' && (
        <CusdisComponent
          lang={fetchCusdisLang()}
          attrs={{
            host: BLOG.comment.cusdisConfig.host,
            appId: BLOG.comment.cusdisConfig.appId,
            pageId: frontMatter.id,
            pageTitle: frontMatter.title,
            pageUrl: BLOG.link + router.asPath,
            theme: 'auto'
          }}
        />
      )}
    </div>
  )
}

export default Comments
