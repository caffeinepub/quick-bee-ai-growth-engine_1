import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from './AppSidebar';

export function Layout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#080c0c' }}>
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
        <footer className="mt-12 px-6 py-4 border-t border-teal/10 text-center text-xs" style={{ color: 'rgba(232,245,244,0.3)' }}>
          <span>© {new Date().getFullYear()} Quick Bee AI Growth Engine. Built with </span>
          <span style={{ color: '#00d4c8' }}>♥</span>
          <span> using </span>
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'quickbee-ai')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal transition-colors"
            style={{ color: '#00b4a6' }}
          >
            caffeine.ai
          </a>
        </footer>
      </main>
    </div>
  );
}
