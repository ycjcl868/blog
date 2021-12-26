import { IconContext } from 'react-icons'

const Layout = ({ children }) => {
  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      {children}
    </IconContext.Provider>
  )
}

export default Layout
