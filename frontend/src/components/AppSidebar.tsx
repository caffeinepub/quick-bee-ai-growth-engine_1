import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard, Users, Briefcase, Settings2, Bot, Settings,
  Zap, GitBranch, BarChart3, PenTool, Webhook, ShoppingCart,
  ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leads', label: 'Lead Management', icon: Users },
  { path: '/services', label: 'Services Catalog', icon: Briefcase },
  { path: '/service-management', label: 'Service Management', icon: Settings2 },
  { path: '/ai-tools', label: 'AI Smart Systems', icon: Bot },
  { path: '/settings', label: 'Sales Config', icon: Settings },
  { path: '/automation', label: 'Automation', icon: Zap },
  { path: '/workflows', label: 'Workflows', icon: GitBranch },
  { path: '/analytics', label: 'Analytics Engine', icon: BarChart3 },
  { path: '/content-creator', label: 'AI Content', icon: PenTool },
  { path: '/webhook-logs', label: 'Webhook Logs', icon: Webhook },
  { path: '/checkout', label: 'Checkout', icon: ShoppingCart },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { totalItems } = useCart();

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-teal/20 ${collapsed ? 'justify-center' : ''}`}>
        <img
          src="/assets/generated/quickbee-logo.dim_256x256.png"
          alt="Quick Bee"
          className="w-9 h-9 rounded-lg flex-shrink-0"
        />
        {!collapsed && (
          <div>
            <div className="font-display font-bold text-sm teal-gradient-text leading-tight">Quick Bee</div>
            <div className="text-xs" style={{ color: 'rgba(232,245,244,0.4)' }}>AI Growth Engine</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                active
                  ? 'text-teal bg-teal/10 border-l-2 border-teal'
                  : 'text-white/50 hover:text-teal hover:bg-teal/8'
              }`}
              style={active ? { color: '#00d4c8', borderLeftColor: '#00d4c8' } : {}}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}
              {path === '/checkout' && totalItems > 0 && !collapsed && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full teal-gradient text-black">
                  {totalItems}
                </span>
              )}
              {path === '/checkout' && totalItems > 0 && collapsed && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-xs font-bold rounded-full teal-gradient text-black flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-3 border-t border-teal/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-teal hover:bg-teal/8 transition-all text-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden glass-card p-2 rounded-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} className="text-teal" /> : <Menu size={20} className="text-teal" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-50 lg:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: '240px',
          background: 'rgba(8,12,12,0.98)',
          borderRight: '1px solid rgba(0,180,166,0.15)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? '64px' : '220px',
          background: 'rgba(8,12,12,0.95)',
          borderRight: '1px solid rgba(0,180,166,0.12)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
