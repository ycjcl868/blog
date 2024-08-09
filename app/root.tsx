import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { ThemeProvider } from "remix-theme";
import { useEffect, lazy, Suspense } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import { IconContext } from "react-icons";
import NProgress from "nprogress";
import "prismjs";
import nProgressStyles from "nprogress/nprogress.css?url";
import "katex/dist/katex.min.css";
import "react-notion-x/src/styles.css";
import { LocaleProvider } from "~/libs/locale";
import "~/styles/globals.css";
import "~/styles/notion.css";
import "~/styles/gitalk.css";
import BLOG from "#/blog.config";
import CJK from "#/cjk";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: nProgressStyles },
];

const Ackee = lazy(() => import("~/components/Ackee"));

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oops!</title>
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}

export const meta: MetaFunction = () => {
  const url = BLOG.path.length ? `${BLOG.link}/${BLOG.path}` : BLOG.link;
  const image = `${BLOG.ogImageGenerateURL}/${encodeURIComponent(
    BLOG.title
  )}.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fnobelium.vercel.app%2Flogo-for-dark-bg.svg`;

  return [
    { title: BLOG.title },
    { property: "og:title", content: BLOG.title },
    { name: "twitter:title", content: BLOG.title },
    {
      name: "description",
      content: BLOG.description,
    },
    {
      property: "og:description",
      content: BLOG.description,
    },
    {
      name: "twitter:description",
      content: BLOG.description,
    },
    {
      property: "og:url",
      content: url,
    },
    {
      name: "twitter:image",
      content: image,
    },
    {
      property: "og:image",
      content: image,
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const meta = {
    title: BLOG.title,
    type: "website",
  };

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="follow, index" />
        <meta property="og:locale" content={BLOG.lang} />
        <meta property="og:type" content="website" />
        <meta charSet="UTF-8" />
        {BLOG.seo.googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={BLOG.seo.googleSiteVerification}
          />
        )}
        {BLOG.seo.keywords && (
          <meta name="keywords" content={BLOG.seo.keywords.join(", ")} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        {meta.type === "article" && (
          <>
            <meta
              property="article:published_time"
              content={meta.date || meta.createdTime}
            />
            <meta property="article:author" content={BLOG.author} />
          </>
        )}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {BLOG.font && BLOG.font === "serif" ? (
          <>
            <link
              rel="preload"
              href="/fonts/SourceSerif.var.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="/fonts/SourceSerif-Italic.var.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          </>
        ) : (
          <>
            <link
              rel="preload"
              href="/fonts/IBMPlexSansVar-Roman.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
            <link
              rel="preload"
              href="/fonts/IBMPlexSansVar-Italic.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
            />
          </>
        )}

        {["zh", "ja", "ko"].includes(
          BLOG.lang.slice(0, 2).toLocaleLowerCase()
        ) && (
          <>
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="anonymous"
            />
            <link
              rel="preload preconnect"
              as="style"
              href={`https://fonts.loli.net/css2?family=Noto+${
                BLOG.font === "serif" ? "Serif" : "Sans"
              }+${CJK()}:wght@400;500;700&display=swap`}
            />
            <link
              rel="stylesheet preconnect prefetch"
              href={`https://fonts.loli.net/css2?family=Noto+${
                BLOG.font === "serif" ? "Serif" : "Sans"
              }+${CJK()}:wght@400;500;700&display=swap`}
            />
            <noscript>
              <link
                rel="stylesheet preconnect prefetch"
                href={`https://fonts.loli.net/css2?family=Noto+${
                  BLOG.font === "serif" ? "Serif" : "Sans"
                }+${CJK()}:wght@400;500;700&display=swap`}
              />
            </noscript>
          </>
        )}
        <link rel="icon" href="/favicon.png" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS 2.0"
          href="/atom.xml"
        ></link>
        {BLOG.appearance === "auto" ? (
          <>
            <meta
              name="theme-color"
              content={BLOG.lightBackground}
              media="(prefers-color-scheme: light)"
            />
            <meta
              name="theme-color"
              content={BLOG.darkBackground}
              media="(prefers-color-scheme: dark)"
            />
          </>
        ) : (
          <meta
            name="theme-color"
            content={
              BLOG.appearance === "dark"
                ? BLOG.darkBackground
                : BLOG.lightBackground
            }
          />
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  return (
    <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
      <LocaleProvider>
        <>
          {BLOG.isProd && BLOG?.analytics?.providers.includes("ackee") && (
            <ClientOnly>
              {() => (
                <Suspense fallback="">
                  <Ackee
                    ackeeServerUrl={BLOG.analytics.ackeeConfig.dataAckeeServer}
                    ackeeDomainId={BLOG.analytics.ackeeConfig.domainId}
                  />
                </Suspense>
              )}
            </ClientOnly>
          )}
          <ThemeProvider attribute="class">
            <Outlet />
          </ThemeProvider>
        </>
      </LocaleProvider>
    </IconContext.Provider>
  );
}
