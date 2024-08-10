import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";
import { IoSunnyOutline, IoMoonSharp } from "react-icons/io5";
import { Theme, useTheme } from "remix-themes";
import BLOG from "#/blog.config";
import { useLocale } from "~/libs/locale";

const NavBar = () => {
  const locale = useLocale();

  const links = [
    { name: locale.NAV.INDEX, to: "/", show: true },
    { name: locale.NAV.ABOUT, to: "/about", show: BLOG.showAbout },
    { name: locale.NAV.SEARCH, to: "/search", show: true },
    { name: locale.NAV.RSS, to: "/atom.xml", show: true, external: true },
  ].map((link, id) => ({ ...link, id }));

  return (
    <div className="shrink-0">
      <ul className="flex flex-row items-center">
        {links.map(
          (link) =>
            link.show && (
              <li
                key={link.id}
                className="block mx-2 text-black dark:text-gray-50 nav"
              >
                <Link
                  className="tracking-wider"
                  target={link.external ? "_blank" : null}
                  to={link.to}
                >
                  {link.name}
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

const Header = ({ fullWidth }) => {
  const useSticky = !BLOG.autoCollapsedNavBar;
  const navRef = useRef(null);
  const sentinalRef = useRef([]);
  const [theme, setTheme] = useTheme();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handler = ([entry]) => {
    if (navRef && navRef.current && useSticky) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current?.classList.add("sticky-nav-full");
      } else {
        navRef.current?.classList.remove("sticky-nav-full");
      }
    } else {
      navRef.current?.classList.add("remove-sticky");
    }
  };
  useEffect(() => {
    const obvserver = new window.IntersectionObserver(handler);
    obvserver.observe(sentinalRef.current);
    // Don't touch this, I have no idea how it works XD
    // return () => {
    //   if (sentinalRef.current) obvserver.unobserve(sentinalRef.current)
    // }
    /* eslint-disable-line */
  }, [sentinalRef]);

  return (
    <>
      <div className="observer-element h-4 md:h-12" ref={sentinalRef}></div>
      <div
        className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-4 md:mb-12 py-8 bg-opacity-60 ${
          !fullWidth ? "max-w-4xl px-4" : "px-4 md:px-24"
        }`}
        id="sticky-nav"
        ref={navRef}
      >
        <div className="flex items-center">
          <Link
            className="md:text-lg text-base text-black dark:text-white"
            aria-label={BLOG.title}
            to="/"
          >
            ✨ {BLOG.title}
          </Link>
        </div>
        <NavBar />
        <div>
          <a
            onClick={() =>
              setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
            }
            title={`Toggle dark mode - current ${theme}`}
            className="hover:text-blue-400 cursor-pointer text-xl"
          >
            {hasMounted && theme === Theme.DARK ? (
              <IoMoonSharp />
            ) : (
              <IoSunnyOutline />
            )}
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
