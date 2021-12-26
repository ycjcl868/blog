import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { IoSunnyOutline, IoMoonSharp } from 'react-icons/io5'
import { useTheme } from 'next-themes'
import BLOG from '@/blog.config'
import { useLocale } from '@/lib/locale'

const NavBar = () => {
  const locale = useLocale()

  const links = [
    { id: 0, name: locale.NAV.INDEX, to: BLOG.path || '/', show: true },
    { id: 1, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
    { id: 2, name: locale.NAV.SEARCH, to: '/search', show: true },
    { id: 3, name: locale.NAV.RSS, to: '/feed', show: true }
  ]
  return (
    <div className='shrink-0'>
      <ul className='flex flex-row items-center'>
        {links.map(
          (link) =>
            link.show && (
              <li
                key={link.id}
                className='block mx-2 text-black dark:text-gray-50 nav'
              >
                <Link href={link.to}>
                  <a>{link.name}</a>
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

const Header = ({ navBarTitle, fullWidth }) => {
  const useSticky = !BLOG.autoCollapsedNavBar
  const navRef = useRef(null)
  const sentinalRef = useRef([])
  const { theme, setTheme } = useTheme()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const handler = ([entry]) => {
    if (navRef && navRef.current && useSticky) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current?.classList.add('sticky-nav-full')
      } else {
        navRef.current?.classList.remove('sticky-nav-full')
      }
    } else {
      navRef.current?.classList.add('remove-sticky')
    }
  }
  useEffect(() => {
    const obvserver = new window.IntersectionObserver(handler)
    obvserver.observe(sentinalRef.current)
    // Don't touch this, I have no idea how it works XD
    // return () => {
    //   if (sentinalRef.current) obvserver.unobserve(sentinalRef.current)
    // }
    /* eslint-disable-line */
  }, [sentinalRef])

  return (
    <>
      <div className='observer-element h-4 md:h-12' ref={sentinalRef}></div>
      <div
        className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-4 md:mb-12 py-8 bg-opacity-60 ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        }`}
        id='sticky-nav'
        ref={navRef}
      >
        <div className='flex items-center'>
          <Link href='/'>
            <a
              className='md:text-lg text-base text-black dark:text-white'
              aria-label={BLOG.title}
            >
              ✨ {BLOG.title}
            </a>
          </Link>
          {navBarTitle ? (
            <p className='ml-2 font-medium text-day dark:text-night header-name'>
              {navBarTitle}
            </p>
          ) : (
            <p className='ml-2 font-medium text-day dark:text-night header-name'>
              <span className='font-normal'>{BLOG.description}</span>
            </p>
          )}
        </div>
        <NavBar />
        <div>
          <a
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title={`Toggle dark mode - current ${theme}`}
            className='hover:text-blue-400 cursor-pointer text-xl'
          >
            {hasMounted && theme === 'dark' ? (
              <IoMoonSharp />
            ) : (
              <IoSunnyOutline />
            )}
          </a>
        </div>
      </div>
    </>
  )
}

export default Header
