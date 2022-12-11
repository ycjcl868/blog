import Image from 'next/image'
import { useTheme } from 'next-themes'
import type { TableOfContentsEntry } from 'notion-utils'
import Container from '@/components/Container'
import TagItem from '@/components/TagItem'
import { NotionRenderer } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import BLOG from '@/blog.config'
import dayjs from 'dayjs'
import { useLocale } from '@/lib/locale'
import { gitHub2jsDelivr } from '@/lib/utils'
import { useRouter } from 'next/router'
import Comments from '@/components/Comments'
import PostActions from '@/components/PostActions'
import TableOfContent from '@/components/TableOfContent'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)

const TweetEmbed = dynamic(() => import('react-tweet-embed'), { ssr: false })

const mapPageUrl = (id) => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const mapImageUrl = (url) => {
  return gitHub2jsDelivr(url)
}

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />
}

interface LayoutProps {
  blockMap: ExtendedRecordMap
  frontMatter: any
  fullWidth?: boolean
  tableOfContent?: TableOfContentsEntry[]
}

const Layout: React.FC<LayoutProps> = ({
  children,
  blockMap,
  tableOfContent,
  frontMatter,
  fullWidth = false
}) => {
  const locale = useLocale()
  const router = useRouter()
  const { theme } = useTheme()
  const date = frontMatter?.date?.start_date || frontMatter.createdTime

  return (
    <Container
      layout='blog'
      title={frontMatter.title}
      description={frontMatter.summary}
      // date={new Date(frontMatter.publishedAt).toISOString()}
      type='article'
      fullWidth={fullWidth}
    >
      <div className='flex flex-row'>
        <article className='md:overflow-x-visible overflow-x-scroll w-full'>
          <h1 className='font-bold text-3xl text-black dark:text-white'>
            {frontMatter.title}
          </h1>
          {frontMatter.type !== 'Page' && (
            <nav className='flex my-7 items-start text-gray-500 dark:text-gray-400'>
              <div className='flex mb-4'>
                <a
                  href={BLOG.socialLink || '#'}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex'
                >
                  <Image
                    alt={BLOG.author}
                    width={24}
                    height={24}
                    src={BLOG.authorAvatar}
                    className='rounded-full'
                  />
                  <p className='ml-2 md:block'>{BLOG.author}</p>
                </a>
                <span className='block'>&nbsp;/&nbsp;</span>
              </div>
              {dayjs(date).isValid() ? (
                <div className='mr-2 mb-4 md:ml-0'>
                  {dayjs(
                    frontMatter?.date?.start_date || frontMatter.createdTime
                  ).format(BLOG.dateFormat)}
                </div>
              ) : null}
              {frontMatter.tags && (
                <div className='flex flex-nowrap max-w-full overflow-x-auto article-tags'>
                  {frontMatter.tags.map((tag) => (
                    <TagItem key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </nav>
          )}
          {children}
          {blockMap && (
            <div className={frontMatter.type !== 'Page' ? '-mt-4' : ''}>
              <NotionRenderer
                recordMap={blockMap}
                components={{
                  Equation,
                  Code,
                  Collection,
                  nextImage: Image,
                  nextLink: Link,
                  Tweet
                }}
                mapPageUrl={mapPageUrl}
                mapImageUrl={mapImageUrl}
                darkMode={theme === 'dark'}
                pageAside={false}
              />
            </div>
          )}
        </article>
        {frontMatter.type !== 'Page' && (
          <aside className='md:flex md:ml-4 sticky md:flex-col md:items-center md:top-36 md:self-start md:flex-auto hidden'>
            {tableOfContent.length > 0 && (
              <TableOfContent
                className='mb-6'
                tableOfContent={tableOfContent}
                mobile
              />
            )}
            <PostActions title={frontMatter.title} />
          </aside>
        )}
      </div>
      <div className='flex justify-between font-medium text-gray-500 dark:text-gray-400 my-5'>
        <a>
          <button
            onClick={() => router.push(BLOG.path || '/')}
            className='mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100'
          >
            ← {locale.POST.BACK}
          </button>
        </a>
        <a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className='mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100'
          >
            ↑ {locale.POST.TOP}
          </button>
        </a>
      </div>
      <Comments frontMatter={frontMatter} />
    </Container>
  )
}

export default Layout
