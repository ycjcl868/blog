import Header from '~/components/Header'
import Footer from '~/components/Footer'
import BLOG from '#/blog.config'

const Container: React.FC<any> = ({
  children,
  title,
  layout,
  fullWidth,
  ...customMeta
}) => {
  const meta = {
    title: title || BLOG.title,
    type: 'website',
    ...customMeta
  }

  return (
    <div>
      <div
        className={`wrapper ${
          BLOG.font === 'serif' ? 'font-serif' : 'font-sans'
        }`}
      >
        <Header
          navBarTitle={layout === 'blog' ? meta.title : null}
          fullWidth={fullWidth}
        />
        <main
          className={`m-auto flex-grow w-full transition-all ${
            !fullWidth ? 'max-w-[52rem] px-4 md:px-0' : 'px-4 md:px-24'
          }`}
        >
          {children}
        </main>
        <Footer fullWidth={fullWidth} />
      </div>
    </div>
  )
}

export default Container
