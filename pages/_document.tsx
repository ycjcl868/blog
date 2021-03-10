import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { cnzz, ga } from 'lib/config'
import { IconContext } from 'react-icons'

export default class MyDocument extends Document {
  render() {
    return (
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Html lang='en'>
          <Head>
            <link rel='shortcut icon' href='/favicon.png' />

            <link
              rel='apple-touch-icon'
              sizes='180x180'
              href='/apple-touch-icon.png'
            />
            <link
              rel='icon'
              type='image/png'
              sizes='96x96'
              href='/favicon-96x96.png'
            />
            <link
              rel='icon'
              type='image/png'
              sizes='32x32'
              href='/favicon-32x32.png'
            />
            <link
              rel='icon'
              type='image/png'
              sizes='16x16'
              href='/favicon-16x16.png'
            />

            <link rel='manifest' href='/manifest.json' />
          </Head>

          <body>
            <script src='noflash.js' />

            <Main />

            <NextScript />
          </body>
          {cnzz?.id && (
            <script
              type='text/javascript'
              dangerouslySetInnerHTML={{
                __html: `document.write(unescape("%3Cspan style='display:none;' id='cnzz_stat_icon_${cnzz.id}'%3E%3C/span%3E%3Cscript src='https://v1.cnzz.com/z_stat.php%3Fid%3D${cnzz.id}' type='text/javascript'%3E%3C/script%3E"));`
              }}
            />
          )}
          {ga?.id && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){
                    if (!location.port) {
                      (function (i, s, o, g, r, a, m) {
                        i['GoogleAnalyticsObject'] = r;
                        i[r] = i[r] || function () {
                            (i[r].q = i[r].q || []).push(arguments)
                          }, i[r].l = 1 * new Date();
                        a = s.createElement(o),
                          m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m)
                      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
                      ga('create', '${ga.id}', 'auto');
                      ga('send', 'pageview');
                    }
                  })();`
              }}
            />
          )}
        </Html>
      </IconContext.Provider>
    )
  }
}
