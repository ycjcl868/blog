import { Client } from '@notionhq/client';
import { getDateValue, getTextContent } from 'notion-utils';

async function getPageProperties(id, block, schema, authToken) {
  const notion = new Client({
    auth: authToken,
  });
  const rawProperties = Object.entries(block?.[id]?.value?.properties || []);
  const excludeProperties = ['date', 'select', 'multi_select', 'person'];
  const properties = {};
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i];
    properties.id = id;
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val);
    } else {
      switch (schema[key]?.type) {
        case 'date': {
          const dateProperty = getDateValue(val);
          delete dateProperty.type;
          properties[schema[key].name] = dateProperty;
          break;
        }
        case 'select':
        case 'multi_select': {
          const selects = getTextContent(val);
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(',');
          }
          break;
        }
        case 'person': {
          const rawUsers = val.flat();
          const users = [];
          for (let i = 0; i < rawUsers.length; i++) {
            if (rawUsers[i][0][1]) {
              const userId = rawUsers[i][0];
              const res = await notion.users.retrieve({
                user_id: userId,
              });

              const user = {
                id: res?.id,
                first_name: res?.name,
                last_name: res?.name,
                profile_photo: res?.avatar_url,
              };
              users.push(user);
            }
          }
          properties[schema[key].name] = users;
          break;
        }
        default:
          break;
      }
    }
  }
  return properties;
}

export { getPageProperties as default };
