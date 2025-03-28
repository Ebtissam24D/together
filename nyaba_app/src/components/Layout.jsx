import React from 'react'
import Header from './header'
import SideBar from './SideBar'

const Layout = ({children}) => {
  return (
    <div className='layout'>
        <Header/>
        <main className='layout_main'>
            <SideBar/>
            <div className='main_container'>
                {children}
            </div>
        </main>
    </div>
  )
}

export default Layout