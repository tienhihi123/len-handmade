import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Layers,
  Box,
  ClipboardList,
  BarChart3,
  Users,
  Bell,
  FileText,
  BookOpen,
  Settings,
  LogOut,
  Search,
  Star,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCircle2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { BRAND_NAME } from "../constants/brand";

const adminMenu = [
  { label: "Dashboard", path: "/admin/dashboard", icon: Home },
  { label: "Quản lý sản phẩm", path: "/admin/products", icon: Box },
  { label: "Quản lý kho", path: "/admin/inventory", icon: Layers },
  { label: "Quản lý đơn hàng", path: "/admin/orders", icon: ClipboardList },
  { label: "Báo cáo doanh thu", path: "/admin/revenue", icon: BarChart3 },
  { label: "Khách hàng", path: "/admin/customers", icon: Users },
  { label: "Thông báo", path: "/admin/notifications", icon: Bell },
  { label: "Đánh giá & Phản hồi", path: "/admin/reviews-feedback", icon: Star },
  { label: "Blog / Tin tức", path: "/admin/blog", icon: FileText },
  { label: "Tài liệu kỹ thuật", path: "/admin/docs", icon: BookOpen },
  { label: "Cài đặt", path: "/admin/settings", icon: Settings }
];

const SIDEBAR_COLLAPSE_KEY = "len_admin_sidebar_collapsed";

export default function AdminLayout() {
  const { currentUser, logoutUser, notificationsList } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  // Close mobile drawer / popovers whenever route changes
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const userTitle = useMemo(() => {
    if (!currentUser) return "Quản trị viên";
    return `${currentUser.name}`;
  }, [currentUser]);

  const activeItem = useMemo(() => {
    const path = location.pathname;
    return (
      adminMenu.find((item) => item.path === path) ||
      (path === "/admin" || path === "/admin/" ? adminMenu[0] : undefined)
    );
  }, [location.pathname]);

  const pageTitle = activeItem?.label ?? "Bảng Điều Khiển";

  const pendingNotifications = useMemo(
    () => notificationsList,
    [notificationsList]
  );
  const recentNotifications = useMemo(
    () => notificationsList.slice(0, 5),
    [notificationsList]
  );

  const filteredSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return adminMenu;
    return adminMenu.filter((item) => item.label.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const initials = useMemo(() => {
    if (!currentUser?.name) return "QT";
    const parts = currentUser.name.trim().split(/\s+/);
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }, [currentUser]);

  const renderMenu = (onNavigate?: () => void) => (
    <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
      {adminMenu.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                collapsed ? "xl:justify-center xl:px-2.5" : ""
              } ${
                isActive
                  ? "bg-[#A96150] text-white shadow-sm"
                  : "text-brand-fb/80 hover:bg-white hover:text-brand-fb"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className={collapsed ? "xl:hidden" : ""}>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-brand-bg text-brand-fb">
      {/* ───────── Mobile drawer backdrop ───────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] xl:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ───────── Mobile drawer sidebar ───────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[82vw] bg-[#FCF7EF] border-r border-brand-primary/10 shadow-xl transition-transform duration-300 xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col px-5 py-6">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="px-4 py-5 rounded-3xl bg-white border border-brand-primary/10 shadow-sm flex-1">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-primary font-bold mb-3">Len Admin</p>
              <h2 className="font-serif font-black text-xl text-brand-fb leading-tight">Store Manager</h2>
              <p className="mt-3 text-[11px] text-brand-fb/70">Giao diện quản lý dành cho {BRAND_NAME}.</p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full bg-white border border-brand-primary/10 text-brand-fb shrink-0"
              aria-label="Đóng menu"
            >
              <X size={16} />
            </button>
          </div>

          {renderMenu(() => setMobileOpen(false))}

          <div className="mt-8 px-4 py-5 rounded-3xl bg-white border border-brand-primary/10 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-primary mb-3">Tài khoản</p>
            <p className="font-sans text-sm font-semibold text-brand-fb">{userTitle}</p>
            <p className="text-[11px] text-brand-fb/60 mt-2">Vai trò: Quản trị viên</p>
            <button
              onClick={handleLogout}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-brand-primary/10 bg-brand-bg py-2 text-[11px] text-brand-fb font-semibold hover:bg-white transition"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* ───────── Desktop sidebar ───────── */}
      <div
        className={`hidden xl:block xl:fixed xl:top-[96px] xl:bottom-0 xl:left-0 bg-[#FCF7EF] border-r border-brand-primary/10 shadow-sm transition-[width] duration-300 ${
          collapsed ? "xl:w-[84px]" : "xl:w-[260px]"
        }`}
      >
        <div className="h-full flex flex-col px-3.5 py-6 relative">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white border border-brand-primary/15 shadow-sm flex items-center justify-center text-brand-fb hover:bg-brand-primary/10 transition"
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>

          <div className="mb-8 px-1.5">
            <div className={`py-5 rounded-3xl bg-white border border-brand-primary/10 shadow-sm ${collapsed ? "px-2 text-center" : "px-4"}`}>
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-primary font-bold mb-3">
                {collapsed ? "LA" : "Len Admin"}
              </p>
              {!collapsed && (
                <>
                  <h2 className="font-serif font-black text-xl text-brand-fb leading-tight">Store Manager</h2>
                  <p className="mt-3 text-[11px] text-brand-fb/70">Giao diện quản lý dành cho {BRAND_NAME}.</p>
                </>
              )}
            </div>
          </div>

          {renderMenu()}

          <div className={`mt-8 rounded-3xl bg-white border border-brand-primary/10 shadow-sm ${collapsed ? "px-2 py-4 text-center" : "px-4 py-5"}`}>
            {!collapsed && (
              <>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-primary mb-3">Tài khoản</p>
                <p className="font-sans text-sm font-semibold text-brand-fb truncate">{userTitle}</p>
                <p className="text-[11px] text-brand-fb/60 mt-2">Vai trò: Quản trị viên</p>
              </>
            )}
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-brand-primary/10 bg-brand-bg py-2 text-[11px] text-brand-fb font-semibold hover:bg-white transition ${
                collapsed ? "w-9 h-9 mt-3 p-0" : "w-full"
              }`}
            >
              <LogOut size={14} /> {!collapsed && "Đăng xuất"}
            </button>
          </div>
        </div>
      </div>

      {/* ───────── Main content column ───────── */}
      <div className={`transition-[padding] duration-300 ${collapsed ? "xl:pl-[84px]" : "xl:pl-[260px]"}`}>
        <header className="sticky top-[64px] lg:top-[96px] z-30 border-b border-brand-primary/10 bg-[#FAF6F0]/95 backdrop-blur-md px-4 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="xl:hidden p-2.5 rounded-full bg-white border border-brand-primary/15 text-brand-fb shrink-0"
                aria-label="Mở menu"
              >
                <Menu size={16} />
              </button>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-brand-primary font-bold">
                  <span>Admin Console</span>
                  <ChevronRight size={11} className="text-brand-fb/30" />
                  <span className="text-brand-fb/50 truncate">{pageTitle}</span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-black text-brand-fb truncate">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Quick search */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center gap-2 bg-white border border-brand-primary/20 rounded-full pl-3.5 pr-2 py-2 shadow-sm">
                    <Search size={14} className="text-brand-fb/40 shrink-0" />
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setSearchOpen(false);
                        if (e.key === "Enter" && filteredSearchResults[0]) {
                          handleSearchSelect(filteredSearchResults[0].path);
                        }
                      }}
                      placeholder="Tìm module quản trị..."
                      className="w-32 sm:w-48 text-xs font-sans outline-none bg-transparent text-brand-fb placeholder:text-brand-fb/40"
                    />
                    <button onClick={() => setSearchOpen(false)} className="p-1 text-brand-fb/40 hover:text-brand-fb">
                      <X size={13} />
                    </button>

                    {searchQuery && (
                      <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-brand-primary/10 rounded-2xl shadow-lg overflow-hidden z-10">
                        {filteredSearchResults.length === 0 ? (
                          <p className="text-xs text-brand-fb/50 italic p-4">Không tìm thấy module phù hợp.</p>
                        ) : (
                          filteredSearchResults.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.path}
                                onClick={() => handleSearchSelect(item.path)}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left text-brand-fb hover:bg-brand-primary/5 transition"
                              >
                                <Icon size={14} className="text-brand-primary shrink-0" />
                                {item.label}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white px-4 py-2 text-xs font-semibold text-brand-fb transition hover:border-brand-primary/30"
                  >
                    <Search size={14} />
                    <span className="hidden sm:inline">Tìm kiếm nhanh</span>
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setProfileOpen(false);
                  }}
                  className="relative p-2.5 rounded-full bg-white border border-brand-primary/15 text-brand-fb transition hover:border-brand-primary/30"
                  aria-label="Thông báo"
                >
                  <Bell size={16} />
                  {pendingNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#BA1A1A] text-white text-[9px] font-bold flex items-center justify-center">
                      {pendingNotifications.length > 9 ? "9+" : pendingNotifications.length}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 w-80 max-w-[85vw] bg-white border border-brand-primary/10 rounded-2xl shadow-lg overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-brand-primary/10 flex items-center justify-between">
                        <p className="text-xs font-bold text-brand-fb uppercase tracking-wide">Thông báo gần đây</p>
                        {pendingNotifications.length > 0 && (
                          <span className="text-[10px] font-bold text-[#BA1A1A]">{pendingNotifications.length} tổng cộng</span>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {recentNotifications.length === 0 ? (
                          <p className="text-xs text-brand-fb/50 italic p-5 text-center">Chưa có thông báo nào.</p>
                        ) : (
                          recentNotifications.map((n) => (
                            <div key={n.id} className="px-4 py-3 border-b border-brand-primary/5 last:border-0 text-left">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-brand-fb truncate">{n.receiver}</span>
                                <span className="text-[9px] text-brand-fb/40 font-mono shrink-0">
                                  {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <p className="text-[11px] text-brand-fb/70 mt-0.5 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <button
                        onClick={() => {
                          navigate("/admin/notifications");
                          setNotifOpen(false);
                        }}
                        className="w-full text-center text-xs font-bold text-brand-primary py-2.5 hover:bg-brand-primary/5 transition"
                      >
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* User profile menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen((v) => !v);
                    setNotifOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full bg-white border border-brand-primary/15 pl-1 pr-3 py-1 transition hover:border-brand-primary/30"
                >
                  <span className="w-7 h-7 rounded-full bg-brand-primary/15 text-brand-primary font-bold text-[11px] flex items-center justify-center font-serif">
                    {initials}
                  </span>
                  <span className="hidden sm:inline text-xs font-semibold text-brand-fb max-w-[110px] truncate">
                    {userTitle}
                  </span>
                  <ChevronDown size={13} className="text-brand-fb/40" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-brand-primary/10 rounded-2xl shadow-lg overflow-hidden z-20">
                      <div className="px-4 py-3 border-b border-brand-primary/10 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-brand-primary/15 text-brand-primary font-bold text-xs flex items-center justify-center font-serif shrink-0">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-brand-fb truncate">{userTitle}</p>
                          <p className="text-[10px] text-brand-fb/50">Quản trị viên</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/admin/settings");
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-left text-brand-fb hover:bg-brand-primary/5 transition"
                      >
                        <UserCircle2 size={15} className="text-brand-primary" />
                        Hồ sơ & Cài đặt
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-left text-[#BA1A1A] hover:bg-red-50 transition border-t border-brand-primary/5"
                      >
                        <LogOut size={15} />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
