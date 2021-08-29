import * as types from 'lib/types'
import Head from 'next/head'
import Image from 'next/image'
import * as React from 'react'
import NotFoundImg from '../public/404.png'
import { PageHead } from './PageHead'
import styles from './styles.module.css'

const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  return (
    <>
      <PageHead site={site} />

      <Head>
        <meta property='og:site_name' content={title} />
        <meta property='og:title' content={title} />

        <title>{title}</title>
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Notion Page Not Found</h1>

          {error ? (
            <p>{error.message}</p>
          ) : (
            pageId && (
              <p>
                Make sure that Notion page "{pageId}" is publicly accessible.
              </p>
            )
          )}

          <Image
            src={NotFoundImg}
            alt='404 Not Found'
            className={styles.errorImage}
          />
        </main>
      </div>
    </>
  )
}

export default Page404
