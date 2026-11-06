import { useState, type ReactNode } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Users,
  Bell,
  LogOut,
  Gavel,
  FolderOpen,
  Droplets,
  BarChart3,
  Mail,
  MessageSquare,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  getDashboardNavBadgeCount,
  useDashboardBadges,
  type DashboardNavBadgeKey,
} from '@/hooks/useDashboardBadges';
import { useScrollLockLayoutFix } from '@/hooks/useScrollLockLayoutFix';
import { DashboardNavBadge } from '@/components/dashboard/DashboardNavBadge';
import { ShaderGradientHero } from '@/components/ShaderGradientHero';

interface DashboardLayoutProps {
  children?: ReactNode;
}
const navigation: Array<{
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badgeKey?: DashboardNavBadgeKey;
}> = [
  { name: 'Αρχική', href: '/dashboard', icon: LayoutDashboard, badgeKey: 'attention-total' },
  { name: 'Ανακοινώσεις', href: '/dashboard/posts', icon: FileText, badgeKey: 'posts-draft' },
  { name: 'Διαγωνισμοί', href: '/dashboard/tenders', icon: Gavel },
  { name: 'Δικαιολογητικά', href: '/dashboard/documents', icon: FolderOpen },
  { name: 'Ποιότητα νερού', href: '/dashboard/water-quality', icon: Droplets },
  { name: 'Στατιστικά', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Αποστολή email', href: '/dashboard/email-notifications', icon: Mail, badgeKey: 'email-queue' },
  { name: 'Προβλήματα', href: '/dashboard/problems', icon: AlertTriangle, badgeKey: 'problems-new' },
  { name: 'Μηνύματα επικοινωνίας', href: '/dashboard/contact-messages', icon: MessageSquare, badgeKey: 'contact-messages-new' },
  { name: 'Συνδρομητές', href: '/dashboard/subscribers', icon: Users, badgeKey: 'subscribers-unverified' },
  { name: 'Ειδοποιήσεις', href: '/dashboard/notifications', icon: Bell, badgeKey: 'notifications-action' },
];
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: badges } = useDashboardBadges();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useScrollLockLayoutFix();
  const handleSignOut = async () => {
    await signOut();
    navigate('/dashboard/login');
    toast({
      title: 'Αποσύνδεση',
      description: 'Έχετε αποσυνδεθεί επιτυχώς',
    });
  };

  const activePage = navigation.find((item) => item.href === location.pathname)?.name || 'Αρχική';

  const renderNavLinks = (onNavigate?: () => void) =>
    navigation.map((item) => {
      const isActive = location.pathname === item.href;
      const badgeCount = getDashboardNavBadgeCount(badges, item.badgeKey);

      return (
        <Link
          key={item.name}
          to={item.href}
          onClick={onNavigate}
          className={cn(
            'dashboard-shell__nav-link',
            isActive && 'dashboard-shell__nav-link--active',
          )}
        >
          <item.icon className="dashboard-shell__nav-icon" aria-hidden />
          <span className="dashboard-shell__nav-label">{item.name}</span>
          <DashboardNavBadge
            count={badgeCount}
            className={cn(
              'dashboard-shell__nav-badge',
              isActive && 'dashboard-shell__nav-badge--active',
            )}
          />
        </Link>
      );
    });

  return (
    <div className="dashboard-shell">      <ShaderGradientHero className="dashboard-shell__shader" bottomGrain organicSpot />
      <div className="dashboard-shell__veil" aria-hidden />

      <div className="dashboard-shell__frame">
        <aside className="dashboard-shell__sidebar hidden md:flex">
          <div className="dashboard-shell__sidebar-head">
            <span className="dashboard-shell__brand-mark" aria-hidden>
              Δ
            </span>
            <div>
              <p className="dashboard-shell__brand-title">ΔΕΥΑΑ</p>
              <p className="dashboard-shell__brand-sub">Dashboard</p>
            </div>
          </div>

          <nav className="dashboard-shell__nav" aria-label="Dashboard navigation">
            {renderNavLinks()}
          </nav>
          <div className="dashboard-shell__sidebar-foot">
            <Button
              type="button"
              variant="ghost"
              className="dashboard-shell__signout"
              onClick={handleSignOut}
            >
              <LogOut className="dashboard-shell__signout-icon" aria-hidden />
              Αποσύνδεση
            </Button>
          </div>
        </aside>

        <div className="dashboard-shell__main">
          <header className="dashboard-shell__topbar">
            <div className="dashboard-shell__topbar-main">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="dashboard-shell__mobile-nav-trigger md:hidden"
                    aria-label="Άνοιγμα μενού"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="dashboard-shell__mobile-sheet w-[18rem] p-0">
                  <SheetHeader className="dashboard-shell__mobile-sheet-head">
                    <SheetTitle className="dashboard-shell__mobile-sheet-title">ΔΕΥΑΑ Dashboard</SheetTitle>
                  </SheetHeader>
                  <nav className="dashboard-shell__nav dashboard-shell__nav--mobile" aria-label="Dashboard navigation">
                    {renderNavLinks(() => setMobileNavOpen(false))}
                  </nav>
                  <div className="dashboard-shell__mobile-sheet-foot">
                    <Button
                      type="button"
                      variant="ghost"
                      className="dashboard-shell__signout"
                      onClick={handleSignOut}
                    >
                      <LogOut className="dashboard-shell__signout-icon" aria-hidden />
                      Αποσύνδεση
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              <div>
                <p className="dashboard-shell__topbar-eyebrow">Διαχείριση</p>
                <h1 className="dashboard-shell__topbar-title">{activePage}</h1>
              </div>
            </div>
            <div className="dashboard-shell__user">
              <div className="dashboard-shell__user-copy">
                <span className="dashboard-shell__user-label">Συνδεδεμένος</span>
                <span className="dashboard-shell__user-email">{user?.email || 'Admin'}</span>
              </div>
              <span className="dashboard-shell__avatar" aria-hidden>
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </header>

          <main className="dashboard-shell__content">
            <div className="dashboard-shell__content-inner">{children || <Outlet />}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
