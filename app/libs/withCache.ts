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

  console.log('contentHash', contentHash);

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
): Promise<T> {
  // fetch data
  const data = await fetchFn();

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
    cacheKey: CacheKeyValue;
    getContentForHash?: (data: T) => any;
  }
): Promise<T> => {
  const { KV, cacheKey, getContentForHash } = options;

  return (async () => {
    if (!KV) {
      return await fetchFn();
    }

    const cachedData = await KV.get<CachedData<T>>(cacheKey, 'json');

    if (cachedData && cachedData?.contentHash) {
      // async update cache
      updateCacheIfNeeded(
        KV,
        fetchFn,
        { cacheKey, getContentForHash },
        cachedData.contentHash
      ).catch(console.error);
      return cachedData.data;
    }

    // if no cache, fetch and cache data
    return fetchAndCacheData(KV, fetchFn, { cacheKey, getContentForHash });
  })();
};
