import BLOG from '#/blog.config';
import { Client } from '@notionhq/client';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

// alias
export const getPropertyValue = (property) => {
  const { type } = property;

  switch (type) {
    case 'text':
    case 'title':
    case 'rich_text': {
      const values = property[type] || [];
      return values?.map?.((v) => v?.plain_text || '').join('') || '';
    }
    case 'select': {
      return property[type]?.name || '';
    }
    case 'multi_select': {
      return property[type]?.map(({ name }) => name);
    }
    case 'date': {
      return property[type]?.start || '';
    }
    case 'last_edited_time': {
      return property[type] || '';
    }
    default: {
      return '';
    }
  }
};

const handlePost = (post) => {
  const properties = Object.keys(post.properties).reduce((acc, curr) => {
    const property = post.properties[curr];
    const value = getPropertyValue(property);
    return { ...acc, [curr]: value };
  }, {});

  return {
    ...(properties || {}),
    id: post.id,
    createdTime: properties.date,
    editedTime: properties?.last_edited_time,
    slug: properties.slug.replace(/^\//, ''),
  };
};

const commonFilter = [{ property: 'status', select: { equals: 'Published' } }];
export const getAllPostsList = async ({
  includePages = false,
  notionPageId,
  notionAccessToken,
}) => {
  const notion = new Client({
    auth: notionAccessToken,
  });
  const dbQuery = {
    database_id: notionPageId,
    filter: {
      and: [
        ...commonFilter,
        ...(includePages
          ? []
          : [
              {
                property: 'type',
                select: { equals: 'Post' },
              },
            ]),
      ],
    },
    sorts: [
      ...(BLOG.sortByDate
        ? [{ property: 'date', direction: 'descending' }]
        : []),
    ],
  };
  const response = await notion.databases.query(dbQuery);
  const posts = response.results.map(handlePost);

  return posts;
};

export const getPost = async ({
  slug: _slug,
  notionPageId,
  notionAccessToken,
}) => {
  const notion = new Client({
    auth: notionAccessToken,
  });
  const slug = _slug.replace(/^\//, '');
  const dbQuery: QueryDatabaseParameters = {
    database_id: notionPageId,
    filter: {
      and: [
        {
          property: 'slug',
          rich_text: {
            equals: slug,
          },
        },
        {
          or: [
            {
              property: 'status',
              select: { equals: 'Published' },
            },
            {
              property: 'status',
              select: { equals: 'Revise' },
            },
          ],
        },
      ],
    },
  };

  const response = await notion.databases.query(dbQuery);
  const posts = response.results.map(handlePost);

  return posts;
};
