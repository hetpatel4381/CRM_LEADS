import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, UserPlus, Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { leadsApi } from '@/api/leads';

const navLinks = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    showCount: false,
    isActive: (p: string) => p === '/',
  },
  {
    to: '/leads',
    label: 'Leads',
    icon: Users,
    showCount: true,
    isActive: (p: string) => p === '/leads' || (p.startsWith('/leads/') && p !== '/leads/new'),
  },
  {
    to: '/leads/new',
    label: 'Add Lead',
    icon: UserPlus,
    showCount: false,
    isActive: (p: string) => p === '/leads/new',
  },
];

function NavItem({
  to,
  label,
  icon: Icon,
  showCount,
  active,
  totalLeads,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
  showCount: boolean;
  active: boolean;
  totalLeads: number;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-primary/[0.08] hover:text-foreground hover:translate-x-0.5'
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 flex-shrink-0',
          active ? 'text-primary-foreground' : 'text-muted-foreground'
        )}
      />
      <span className="flex-1">{label}</span>
      {showCount && totalLeads > 0 && (
        <span
          className={cn(
            'text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center tabular-nums',
            active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
          )}
        >
          {totalLeads}
        </span>
      )}
    </Link>
  );
}

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const { data: leadsData } = useQuery({
    queryKey: ['leads', { page: 1, limit: 1 }],
    queryFn: () => leadsApi.getAll({ page: 1, limit: 1 }),
    staleTime: 60_000,
  });

  const totalLeads = leadsData?.total ?? 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col md:w-60 border-r bg-card">
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">LeadCRM</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              active={item.isActive(pathname)}
              totalLeads={totalLeads}
            />
          ))}
        </nav>

        <div className="px-6 py-4 border-t text-xs text-muted-foreground">
          Real Estate CRM · v1.0
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">LeadCRM</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((item) => (
            <NavItem
              key={item.to}
              {...item}
              active={item.isActive(pathname)}
              totalLeads={totalLeads}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b bg-card sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold">LeadCRM</span>
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
