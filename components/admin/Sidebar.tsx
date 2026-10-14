'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/lib/admin/auth';
import { CalendarSvg, ClipboardSvg, HeartPulseSvg } from '@/components/ui/MedicalIcons';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: 'crm' | 'appointments' | 'leads' | 'blog' | 'analytics') => void;
}

const NAV_ITEMS = [
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'appointments', label: 'Agendamentos', icon: CalendarSvg },
  { id: 'leads', label: 'Leads', icon: ClipboardSvg },
  { id: 'blog', label: 'Blog', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
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

  return (
    <aside
      className={`flex flex-col bg-surface-dark transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } min-h-screen`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/60 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/95 shadow-soft flex-shrink-0 overflow-hidden">
          <HeartPulseSvg className="h-6 w-6 text-surgical-teal" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="block text-sm font-bold text-white truncate">Admin</span>
            <span className="block text-[11px] text-brand-muted truncate">Herlon Moura</span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mt-3 flex items-center justify-center rounded-2xl p-1.5 text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-colors"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Navigation */}
      <nav className="mt-4 flex-1 space-y-1.5 px-2" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id || pathname.startsWith(item.id === 'crm' ? '/admin/crm' : `/admin/${item.id}`);
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as 'crm' | 'appointments' | 'leads' | 'blog' | 'analytics')}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-accent/10 text-white border-l-2 border-brand-accent'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
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
            <p className="text-xs font-medium text-slate-300 truncate">Administrador</p>
            <p className="text-[11px] text-slate-500 truncate">admin@herlonmoura.com.br</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors ${
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
