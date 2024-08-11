import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import clsx from "clsx";
import { useEffect, lazy, Suspense } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/cloudflare";
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
import { themeSessionResolver } from "./sessions.server";
import {
  useTheme,
  Theme,
  ThemeProvider,
  PreventFlashOnWrongTheme,
} from "remix-themes";
import remixImageStyles from "@udisc/remix-image/remix-image.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: nProgressStyles },
  { rel: "stylesheet", href: remixImageStyles },
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

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const url = BLOG.path.length ? `${BLOG.link}/${BLOG.path}` : BLOG.link;
  const image = `${BLOG.ogImageGenerateURL}/${encodeURIComponent(
    BLOG.title
  )}.png?theme=${
    data?.theme === Theme.DARK ? "dark" : "light"
  }&md=1&fontSize=125px&images=https%3A%2F%2Fnobelium.vercel.app%2Flogo-for-dark-bg.svg`;

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

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  const meta = {
    title: BLOG.title,
    type: "website",
  };

  return (
    <html
      lang="en"
      style={{
        // @ts-ignore
        colorScheme: theme,
      }}
      className={clsx(theme)}
    >
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
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
        {BLOG?.font === "serif" ? (
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Scripts crossOrigin="anonymous" src="/polyfill.js" />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const navigation = useNavigation();
  const data = useLoaderData<typeof loader>();
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
          <ThemeProvider
            specifiedTheme={data.theme}
            themeAction="/action/set-theme"
          >
            <App />
          </ThemeProvider>
        </>
      </LocaleProvider>
    </IconContext.Provider>
  );
}
