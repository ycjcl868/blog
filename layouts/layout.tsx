import Image from 'next/image'
import { useTheme } from 'next-themes'
import Container from '@/components/Container'
import TagItem from '@/components/TagItem'
import {
  NotionRenderer,
  Equation,
  Code,
  Collection,
  CollectionRow
} from 'react-notion-x'
import BLOG from '@/blog.config'
import dayjs from 'dayjs'
import { useLocale } from '@/lib/locale'
import { useRouter } from 'next/router'
import Comments from '@/components/Comments'
import PostActions from '@/components/PostActions'

const mapPageUrl = (id) => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const Layout = ({ children, blockMap, frontMatter, fullWidth = false }) => {
  const locale = useLocale()
  const router = useRouter()
  const { theme } = useTheme()

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
        <article className='md:overflow-x-visible overflow-x-scroll'>
          <h1 className='font-bold text-3xl text-black dark:text-white'>
            {frontMatter.title}
          </h1>
          {frontMatter.type[0] !== 'Page' && (
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
              <div className='mr-2 mb-4 md:ml-0'>
                {dayjs(
                  frontMatter?.date?.start_date || frontMatter.createdTime
                ).format(BLOG.dateFormat)}
              </div>
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
            <div className={frontMatter.type[0] !== 'Page' ? '-mt-4' : ''}>
              <NotionRenderer
                recordMap={blockMap}
                components={{
                  equation: Equation,
                  code: Code,
                  collection: Collection,
                  collectionRow: CollectionRow
                }}
                mapPageUrl={mapPageUrl}
                darkMode={theme === 'dark'}
                pageAside={false}
              />
            </div>
          )}
        </article>
        {frontMatter.type[0] !== 'Page' && (
          <aside className='md:flex md:ml-8 sticky md:flex-col md:items-center md:top-36 md:self-start md:flex-auto hidden'>
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
