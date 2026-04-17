import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  UserPlus, 
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: Package },
    { name: 'Sub-Admins', path: '/admin/sub-admins', icon: UserPlus },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl lg:shadow-sm 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <button className="flex items-center" onClick={() => navigate('/')}>
            <img src="/images/logoImage.png" alt="Abhivriddhi" className="h-7 w-auto object-contain" />
          </button>
          <button className="lg:hidden p-1 text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#f0fdf4] text-[#1a3d0c] shadow-sm border border-[#dcfce7]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon size={20} className={isActive ? 'text-[#1a3d0c]' : 'text-gray-400'} />
                    <span className="flex-1">{item.name}</span>
                    <ChevronRight size={14} className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
           >
              <LogOut size={16} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between lg:justify-end px-4 lg:px-8 shadow-sm">
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <Menu size={24} />
           </button>

           <div className="flex items-center gap-3">
             <span className="hidden sm:block text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Administrator Panel</span>
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-black shadow-md text-xs">
                A
             </div>
             <span className="font-black text-slate-800 tracking-tight">Abhivriddhi</span>
           </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
