import BLOG from "#/blog.config";
import { useEffect, lazy, Suspense } from "react";
import { useTheme, Theme } from "remix-themes";
import { useLocation } from "@remix-run/react";
import { ClientOnly } from "./ClientOnly";

const GitalkComponent = lazy(() => import("~/components/Gitalk"));
const UtterancesComponent = lazy(() => import("~/components/Utterances"));
const CusdisComponent = lazy(() =>
  import("react-cusdis").then((mod) => ({
    default: mod.ReactCusdis,
  }))
);

const Comments = ({ frontMatter }) => {
  const location = useLocation();
  const [theme] = useTheme();

  const cusdisTheme = theme === Theme.DARK ? Theme.DARK : Theme.LIGHT;

  useEffect(() => {
    if (typeof window !== "undefined" && window.CUSDIS) {
      window.CUSDIS.setTheme(cusdisTheme);
    }
  }, [cusdisTheme]);

  return (
    <div>
      {BLOG.comment && BLOG.comment.provider === "gitalk" && (
        <Suspense fallback="">
          <GitalkComponent
            options={{
              id: frontMatter.id,
              title: frontMatter.title,
              clientID: BLOG.comment.gitalkConfig.clientID,
              clientSecret: BLOG.comment.gitalkConfig.clientSecret,
              repo: BLOG.comment.gitalkConfig.repo,
              owner: BLOG.comment.gitalkConfig.owner,
              admin: BLOG.comment.gitalkConfig.admin,
              distractionFreeMode:
                BLOG.comment.gitalkConfig.distractionFreeMode,
              proxy: BLOG.comment.gitalkConfig.proxy,
            }}
          />
        </Suspense>
      )}
      {BLOG.comment && BLOG.comment.provider === "utterances" && (
        <Suspense fallback="">
          <UtterancesComponent issueTerm={frontMatter.id} />
        </Suspense>
      )}
      {BLOG.comment && BLOG.comment.provider === "cusdis" && (
        <ClientOnly>
          {() => (
            <Suspense fallback="">
              <CusdisComponent
                lang="zh-cn"
                attrs={{
                  host: BLOG.comment.cusdisConfig.host,
                  appId: BLOG.comment.cusdisConfig.appId,
                  pageId: frontMatter.id,
                  pageTitle: frontMatter.title,
                  pageUrl: BLOG.link + location.pathname,
                  theme: "auto",
                }}
              />
            </Suspense>
          )}
        </ClientOnly>
      )}
    </div>
  );
};

export default Comments;
