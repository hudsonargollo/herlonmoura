'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '@/lib/admin/auth';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: 'crm' | 'appointments' | 'leads' | 'blog') => void;
}

const NAV_ITEMS = [
  { id: 'crm', label: 'CRM', href: '/admin/crm', icon: Users },
  { id: 'appointments', label: 'Agendamentos', href: '/admin/crm/appointments', icon: Calendar },
  { id: 'leads', label: 'Leads', href: '/admin/crm/leads', icon: ClipboardList },
  { id: 'blog', label: 'Blog', href: '/admin/blog', icon: FileText },
];

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  const navItems = NAV_ITEMS;

  return (
    <aside
      className={`flex flex-col bg-slate-950 border-r border-slate-800/60 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/60 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surgical-teal/15 text-surgical-teal flex-shrink-0">
          <HeartPulse className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="block text-sm font-bold text-white truncate">Admin</span>
            <span className="block text-[11px] text-neutral-medium truncate">Herlon Moura</span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mt-3 flex items-center justify-center rounded-md p-1.5 text-neutral-medium hover:bg-slate-900 hover:text-neutral-light transition-colors"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-2" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || pathname.startsWith(item.href);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as 'crm' | 'appointments' | 'leads' | 'blog')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-surgical-teal/10 text-surgical-teal'
                  : 'text-neutral-medium hover:bg-slate-900 hover:text-neutral-light'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className={`border-t border-slate-800/60 px-3 py-3 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <div className="mb-2">
            <p className="text-xs font-medium text-neutral-light truncate">Administrador</p>
            <p className="text-[11px] text-neutral-medium truncate">admin@herlonmoura.com.br</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-medium hover:bg-red-500/10 hover:text-red-400 transition-colors ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}