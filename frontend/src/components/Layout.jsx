import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useSidebar } from '../contexts/SidebarContext'

function Layout() {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Wrapper - Adapts to sidebar state */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Header - Altura 64px (16 * 4) */}
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <div className="m-2">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default Layout
