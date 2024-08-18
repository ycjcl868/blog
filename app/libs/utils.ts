import BLOG from '#/blog.config';
import { Block } from 'notion-types';
import { defaultMapImageUrl, type MapImageUrlFn } from 'react-notion-x';

const buildJsDelivrLink = (user, repo, version, path) => {
  if (version === 'latest') {
    return `https://cdn.jsdelivr.net/gh/${user}/${repo}/${path}`;
  }

  return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${version}/${path}`;
};

export const gitHub2jsDelivr = (gitHub: string) => {
  const pattern =
    /^https?:\/\/(?:github|raw\.githubusercontent)\.com\/([^/]+)\/([^/]+)(?:\/blob)?\/([^/]+)\/(.*)$/i;
  const match = pattern.exec(gitHub);

  if (match) {
    const [, user, repo, version, file] = match;

    return buildJsDelivrLink(user, repo, version, file);
  }

  return gitHub;
};

export const mapPageUrl = (id) => {
  return 'https://www.notion.so/' + id.replace(/-/g, '');
};

export const mapCoverUrl = (url: string) => {
  return 'https://www.notion.so' + url;
};

export const mapImageUrl: MapImageUrlFn = (url: string, block: Block) => {
  try {
    if (new URL(url)?.host === BLOG.defaultImageHost) {
      return url;
    }
  } catch (e) {
    console.warn('[mapImageUrl WARN]', url, e);
    return url;
  }
  return defaultMapImageUrl(url, block) || '';
};

export const environment = process.env.NODE_ENV || 'development';
export const isDev = environment === 'development';
