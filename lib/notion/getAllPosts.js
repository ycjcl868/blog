import BLOG from '@/blog.config'
import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { idToUuid } from 'notion-utils'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'

const notion = new Client({
  auth: BLOG.notionAccessToken
})
const databaseId = BLOG.notionPageId

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */
export async function getAllPosts({ includePages = false }) {
  let id = BLOG.notionPageId
  const authToken = null
  const api = new NotionAPI({ authToken })
  const response = await api.getPage(id)

  id = idToUuid(id)
  const collection = Object.values(response.collection)[0]?.value
  const collectionQuery = response.collection_query
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value

  // Check Type
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    return null
  } else {
    // Construct Data
    const pageIds = getAllPageIds(collectionQuery)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null

      // Add fullwidth, createdtime to properties
      properties.createdTime = new Date(
        block[id].value?.created_time
      ).toString()
      properties.fullWidth = block[id].value?.format?.page_full_width ?? false

      data.push(properties)
    }

    // remove all the the items doesn't meet requirements
    const posts = filterPublishedPosts({ posts: data, includePages })

    // Sort by date
    if (BLOG.sortByDate) {
      posts.sort((a, b) => {
        const dateA = new Date(a?.date?.start_date || a.createdTime)
        const dateB = new Date(b?.date?.start_date || b.createdTime)
        return dateB - dateA
      })
    }
    return posts.map((post) => ({
      ...post,
      slug: post.slug.replace(/^\//, '')
    }))
  }
}

export const getPropertyValue = (property) => {
  const { type } = property

  switch (type) {
    case 'text':
    case 'title':
    case 'rich_text': {
      const values = property[type] || []
      return values?.map?.((v) => v?.plain_text || '').join('') || ''
    }
    case 'select': {
      return property[type]?.name || ''
    }
    case 'multi_select': {
      return property[type]?.map(({ name }) => name)
    }
    case 'date': {
      return property[type]?.start || ''
    }
    default: {
      return ''
    }
  }
}

const handlePost = (post) => {
  const properties = Object.keys(post.properties).reduce((acc, curr) => {
    const property = post.properties[curr]
    const value = getPropertyValue(property)
    return { ...acc, [curr]: value }
  }, {})
  return {
    ...(properties || {}),
    id: post.id,
    createdTime: properties.date,
    slug: properties.slug.replace(/^\//, '')
  }
}

export const getAllPostsList = async ({ includePages = false }) => {
  const dbQuery = {
    database_id: databaseId,
    filter: {
      and: [
        { property: 'status', select: { equals: 'Published' } },
        ...(includePages
          ? []
          : [
              {
                property: 'type',
                select: { equals: 'Post' }
              }
            ])
      ]
    },
    sorts: [{ property: 'date', direction: 'descending' }]
  }

  const response = await notion.databases.query(dbQuery)
  const posts = response.results.map(handlePost)

  // Sort by date
  if (BLOG.sortByDate) {
    posts.sort((a, b) => {
      const dateA = new Date(a.createdTime)
      const dateB = new Date(b.createdTime)
      return dateB - dateA
    })
  }

  return posts
}

export const getPost = async ({ slug: _slug }) => {
  const slug = _slug.replace(/^\//, '')
  const dbQuery = {
    database_id: databaseId,
    filter: {
      and: [
        { property: 'status', select: { equals: 'Published' } },
        {
          property: 'slug',
          rich_text: {
            equals: slug
          }
        }
      ]
    }
  }

  const response = await notion.databases.query(dbQuery)
  const posts = response.results.map(handlePost)

  return posts
}
