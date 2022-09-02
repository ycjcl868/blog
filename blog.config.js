const BLOG = {
  title: '信鑫 Blog',
  author: 'ycjcl868',
  authorAvatar: '/avatar.jpeg',
  email: 'chaolinjin@gmail.com',
  link: 'https://www.rustc.cloud',
  description: '写写文章的地方',
  lang: 'en-US', // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES']
  dateFormat: 'YYYY-MM-DD',
  appearance: 'auto', // ['light', 'dark', 'auto'],
  font: 'sans-serif', // ['sans-serif', 'serif']
  lightBackground: '#ffffff', // use hex value, don't forget '#' e.g #fffefc
  darkBackground: '#18181B', // use hex value, don't forget '#'
  path: '', // leave this empty unless you want to deploy Nobelium in a folder
  since: 2021, // If leave this empty, current year will be used.
  postsPerPage: 7,
  sortByDate: true,
  showAbout: true,
  showArchive: true,
  autoCollapsedNavBar: false, // The automatically collapsed navigation bar
  ogImageGenerateURL: 'https://og-image-craigary.vercel.app', // The link to generate OG image, don't end with a slash
  socialLink: 'https://twitter.com/ycjcl',
  seo: {
    keywords: ['Blog', 'Website', '信鑫', 'ycjcl868'],
    googleSiteVerification: '' // Remove the value or replace it with your own google site verification code
  },
  notionPageId: process.env.NOTION_PAGE_ID, // DO NOT CHANGE THIS！！！
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN, // Useful if you prefer not to make your database public
  analytics: {
    providers: ['ga', 'cnzz'], // Currently we support Google Analytics and Ackee, please fill with 'ga' or 'ackee', leave it empty to disable it.
    ackeeConfig: {
      tracker: '', // e.g 'https://ackee.craigary.net/tracker.js'
      dataAckeeServer: '', // e.g https://ackee.craigary.net , don't end with a slash
      domainId: '' // e.g '0e2257a8-54d4-4847-91a1-0311ea48cc7b'
    },
    gaConfig: {
      measurementId: 'G-QNHPPR60EZ' // e.g: G-XXXXXXXXXX
    },
    cnzzConfig: {
      id: '1279745642'
    }
  },
  comment: {
    // support provider: gitalk, utterances, cusdis
    provider: 'gitalk', // leave it empty if you don't need any comment plugin
    gitalkConfig: {
      repo: 'blog', // The repository of store comments
      owner: 'ycjcl868',
      admin: ['ycjcl868'],
      clientID: '26baba385d964968e855',
      clientSecret: '56f5bf32b9785258727c624d7fbd2984361315e3',
      distractionFreeMode: false,
      proxy: 'https://www.rustc.cloud/api/get_access_token'
    },
    utterancesConfig: {
      repo: ''
    },
    cusdisConfig: {
      appId: 'f099af17-208a-4dce-805a-1afcab66c7b1', // data-app-id
      host: 'https://cusdis.com', // data-host, change this if you're using self-hosted version
      scriptSrc: 'https://cusdis.com/js/cusdis.umd.js' // change this if you're using self-hosted version
    }
  },
  isProd: process.env.VERCEL_ENV === 'production' // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
}
// export default BLOG
module.exports = BLOG
