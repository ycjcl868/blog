import isEmpty from 'lodash.isempty';

export const CACHE_KEY = {
  blogList: 'blog_list',
  getBlogDetail: (slug: string) => `blog_detail_${slug}`,
  getBlogBlocks: (slug: string, id: string) =>
    `blog_detail_${slug}_blocks_${id}`,
};

type CacheKeyValue =
  | typeof CACHE_KEY.blogList
  | ReturnType<typeof CACHE_KEY.getBlogDetail>;

interface CachedData<T> {
  data: T;
  contentHash: string;
  lastUpdated: string;
}

const generateContentHash = async (content: any): Promise<string> => {
  const contentBuffer = new TextEncoder().encode(JSON.stringify(content));

  const digest = await crypto.subtle.digest(
    {
      name: 'SHA-256',
    },
    contentBuffer
  );

  const contentHash = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return contentHash;
};

async function updateCacheIfNeeded<T>(
  KV: KVNamespace,
  fetchFn: (...args: any[]) => Promise<T>,
  options: { cacheKey: string; getContentForHash?: (data: T) => any },
  oldContentHash: string
) {
  // fetch latest data
  const freshData = await fetchFn();

  // calculate new data hash
  const contentForHash = options.getContentForHash
    ? options.getContentForHash(freshData)
    : freshData;
  const newContentHash = await generateContentHash(contentForHash);

  // if content hash is different, update cache
  if (newContentHash !== oldContentHash) {
    await KV.put(
      options.cacheKey,
      JSON.stringify({
        data: freshData,
        contentHash: newContentHash,
        lastUpdated: new Date().toISOString(),
      })
    );
    console.log(`Cache updated for ${options.cacheKey}`);
  } else {
    console.log(`Content unchanged for ${options.cacheKey}, cache not updated`);
  }
}

async function fetchAndCacheData<T>(
  KV: KVNamespace,
  fetchFn: (...args: any[]) => Promise<T>,
  options: { cacheKey: string; getContentForHash?: (data: T) => any }
): Promise<T | null> {
  // fetch data
  const data = await fetchFn();

  if (isEmpty(data)) {
    return data;
  }

  const contentForHash = options.getContentForHash
    ? options.getContentForHash(data)
    : data;
  const contentHash = await generateContentHash(contentForHash);

  await KV.put(
    options.cacheKey,
    JSON.stringify({
      data,
      contentHash,
      lastUpdated: new Date().toISOString(),
    })
  );

  return data;
}

export const withKVCache = <T>(
  fetchFn: (...args: any[]) => Promise<T>,
  options: {
    KV: KVNamespace;
    updateCache?: boolean;
    cacheKey: CacheKeyValue;
    getContentForHash?: (data: T) => any;
  }
): Promise<[T, string]> => {
  const { KV, cacheKey, getContentForHash, updateCache = false } = options;

  console.log('[withKVCache] updateCache', updateCache);

  return (async () => {
    if (!KV) {
      console.log('no KV');
      const data = await fetchFn();
      const contentForHash = getContentForHash ? getContentForHash(data) : data;
      const contentHash = await generateContentHash(contentForHash);
      return [data, contentHash];
    }

    try {
      const cachedData = await KV.get<CachedData<T>>(cacheKey, 'json');

      if (cachedData && cachedData?.contentHash) {
        if (updateCache) {
          // async update cache
          await updateCacheIfNeeded(
            KV,
            fetchFn,
            { cacheKey, getContentForHash },
            cachedData.contentHash
          ).catch(console.error);
        }

        return [cachedData.data, cachedData.contentHash];
      }
    } catch (error) {
      console.error(error);
    }

    // if no cache, fetch and cache data
    const data = await fetchAndCacheData(KV, fetchFn, {
      cacheKey,
      getContentForHash,
    });

    if (isEmpty(data)) {
      return [data, ''];
    }
    console.log('no cache, fetch and cache data');
    const contentForHash =
      getContentForHash && data ? getContentForHash(data) : data;
    const contentHash = await generateContentHash(contentForHash);

    return [data, contentHash];
  })();
};
