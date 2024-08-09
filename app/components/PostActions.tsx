import type { ReactNode } from 'react'
import BLOG from '#/blog.config'
import { useLocation } from '@remix-run/react'

import cs from 'classnames'

import styles from './PostActions.module.css'

interface SocialLink {
  name: string
  title: string
  icon: ReactNode
  href?: string
}

const PostActions: React.FC<{ title: string }> = (props) => {
  const { title } = props
  const location = useLocation()
  const socialLinks: SocialLink[] = [
    {
      name: 'twitter',
      href: `https://twitter.com/intent/tweet?url=${BLOG.link}${location.pathname}&text=${title}`,
      title: 'Twitter',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z' />
        </svg>
      )
    }
  ].filter(Boolean)

  return (
    <div
      className={cs(
        'flex flex-col items-center text-center text-day dark:text-night'
      )}
    >
      {socialLinks.map((action) => (
        <a
          className={cs(
            styles.action,
            styles[action.name],
            'flex flex-col justify-center items-center select-none cursor-pointer relative rounded-full border-2 border-solid border-gray-700 dark:border-gray-300 text-gray-700 dark:text-gray-300'
          )}
          href={action.href}
          key={action.name}
          title={action.title}
          target='_blank'
          rel='noopener noreferrer'
        >
          <div className={styles.actionBg}>
            <div className={cs(styles.actionBgPane, 'w-0 h-0 rounded-full')} />
          </div>

          <div className={styles.actionBg}>{action.icon}</div>
        </a>
      ))}
    </div>
  )
}

export default PostActions
