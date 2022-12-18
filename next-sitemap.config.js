const BLOG = require('./blog.config')

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: BLOG.link,
  generateRobotsTxt: true
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
