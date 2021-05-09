import React from 'react'
import { DiscussionEmbed } from 'disqus-react'

import styles from './styles.module.css'

interface CommentsProps {
  identifier: string
  theme: string
  shortname: string
}

export const Comments: React.FC<CommentsProps> = ({
  identifier,
  theme,
  shortname
}) => {
  console.log('theme', theme)
  return (
    <div className={styles.comments}>
      <DiscussionEmbed
        // @ts-ignore
        theme={theme}
        shortname={shortname}
        config={{ identifier }}
      />
    </div>
  )
}
