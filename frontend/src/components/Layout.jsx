import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

function Layout() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Header - Altura 64px (16 * 4) */}
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <div className="container-custom py-6 lg:py-8">
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
