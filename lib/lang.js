import BLOG from '@/blog.config'

const lang = {
  en: {
    NAV: {
      INDEX: 'Blog',
      LIFE: 'Life',
      RSS: 'RSS',
      SEARCH: 'Search',
      ABOUT: 'About'
    },
    PAGINATION: {
      PREV: 'Prev',
      NEXT: 'Next'
    },
    POST: {
      BACK: 'Back',
      TOP: 'Top'
    },
    TAG: 'Tag'
  },
  'zh-CN': {
    NAV: {
      INDEX: '文章',
      LIFE: '生活',
      RSS: 'RSS',
      SEARCH: '搜索',
      ABOUT: '关于'
    },
    PAGINATION: {
      PREV: '上一页',
      NEXT: '下一页'
    },
    POST: {
      BACK: '返回',
      TOP: '回到顶部'
    },
    TAG: '标签'
  }
}

export const fetchLocaleLang = () => {
  switch (BLOG.lang.toLowerCase()) {
    case 'zh-cn':
    case 'zh-sg':
      return lang['zh-CN']
    case 'zh-hk':
      return lang['zh-HK']
    case 'zh-tw':
      return lang['zh-TW']
    case 'ja':
    case 'ja-jp':
      return lang.ja
    case 'es':
    case 'es-ES':
      return lang.es
    case 'en':
    case 'en-us':
    default:
      return lang.en
  }
}
