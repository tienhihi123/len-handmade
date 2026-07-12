import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Box, Layers, ClipboardList, BarChart3, Users, Bell, Star,
  FileText, RefreshCw, LifeBuoy, UserCog, ShieldCheck, Settings,
  ScrollText, LogOut, Search, Menu, X, ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { PermissionKey, STAFF_ROLE_DASHBOARD_PATH, STAFF_ROLE_LABELS } from "../../lib/permissions";
import { subscribeToTicketsForAdmin } from "../../lib/firestoreTickets";
import { subscribeToShopNotifications, markShopNotificationRead } from "../../lib/firestoreOrdersAdmin";
import type { SupportTicket, ShopNotification } from "../../types";
import sidebarBrandArt from "../../assets/images/That one Evernight Dance  _ Honkai star rail animation _ Honkai star rail Edit _.jpeg";

interface AdminModule {
  label: string;
  path: string;
  icon: typeof Home;
  permission: PermissionKey;
}

const SIDEBAR_COLLAPSE_KEY = "len_control_panel_sidebar_collapsed";

export default function AdminShell() {
  const { currentUser, logoutUser, notificationsList } = useApp();
  const { staff, can } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close notif/profile dropdowns on outside click without a full-screen backdrop,
  // which previously intercepted clicks meant for other header controls (e.g. search).
  useEffect(() => {
    if (!notifOpen && !profileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen, profileOpen]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

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

  const allModules: AdminModule[] = useMemo(() => {
    if (!staff) return [];
    const dashboardPath = STAFF_ROLE_DASHBOARD_PATH[staff.roleId];
    return [
      { label: "Dashboard", path: dashboardPath, icon: Home, permission: "dashboard.view" },
      { label: "Sản phẩm", path: "/admin/products", icon: Box, permission: "products.view" },
      { label: "Danh mục", path: "/admin/categories", icon: Layers, permission: "categories.view" },
      { label: "Kho hàng", path: "/admin/inventory", icon: ClipboardList, permission: "inventory.view" },
      { label: "Đơn hàng", path: "/admin/orders", icon: RefreshCw, permission: "orders.view" },
      { label: "Đổi trả & Hoàn tiền", path: "/admin/returns", icon: RefreshCw, permission: "returns.view" },
      { label: "Khách hàng", path: "/admin/customers", icon: Users, permission: "customers.view" },
      { label: "Đánh giá", path: "/admin/reviews-feedback", icon: Star, permission: "reviews.view" },
      { label: "Ticket hỗ trợ", path: "/admin/tickets", icon: LifeBuoy, permission: "feedback.view" },
      { label: "Mã giảm giá", path: "/admin/coupons", icon: FileText, permission: "coupons.view" },
      { label: "Blog / Tin tức", path: "/admin/blog", icon: FileText, permission: "blog.view" },
      { label: "Thông báo", path: "/admin/notifications", icon: Bell, permission: "notifications.view" },
      { label: "Báo cáo doanh thu", path: "/admin/revenue", icon: BarChart3, permission: "reports.view" },
      { label: "Nhân viên", path: "/admin/staff", icon: UserCog, permission: "staff.view" },
      { label: "Phân quyền", path: "/admin/roles", icon: ShieldCheck, permission: "roles.view" },
      { label: "Nhật ký kiểm toán", path: "/admin/audit", icon: ScrollText, permission: "audit.view" },
      { label: "Cài đặt", path: "/admin/settings", icon: Settings, permission: "settings.view" }
    ];
  }, [staff]);

  // Staff/roles management is temporarily locked (nhân viên & phân quyền
  // tạm khóa) — hidden from the sidebar only; direct routes still respect
  // their own permission guards.
  const HIDDEN_PATHS = ["/admin/staff", "/admin/roles"];
  const visibleModules = useMemo(
    () => allModules.filter((m) => can(m.permission) && !HIDDEN_PATHS.includes(m.path)),
    [allModules, can]
  );

  const activeItem = useMemo(
    () => visibleModules.find((m) => location.pathname === m.path || location.pathname.startsWith(m.path + "/")),
    [visibleModules, location.pathname]
  );
  const pageTitle = activeItem?.label ?? "Control Panel";

  const pendingNotifications = useMemo(() => notificationsList.filter((n) => n.status === "pending"), [notificationsList]);
  const recentNotifications = useMemo(() => notificationsList.slice(0, 5), [notificationsList]);

  // New customer support tickets surface here too, so admins get a bell
  // alert without having to keep the Tickets page open.
  const TICKETS_LAST_SEEN_KEY = "len_admin_tickets_last_seen";
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  useEffect(() => subscribeToTicketsForAdmin(setTickets), []);
  const lastSeenTicketsAt = localStorage.getItem(TICKETS_LAST_SEEN_KEY) || "1970-01-01T00:00:00.000Z";
  const newTickets = useMemo(
    () => tickets.filter((t) => t.createdAt > lastSeenTicketsAt).slice(0, 5),
    [tickets, lastSeenTicketsAt]
  );
  // Khách báo chuyển khoản — real-time từ Firestore, đếm vào chuông
  const [shopNotifications, setShopNotifications] = useState<ShopNotification[]>([]);
  useEffect(() => subscribeToShopNotifications(setShopNotifications), []);
  const unreadPaymentReports = useMemo(() => shopNotifications.filter((n) => !n.read), [shopNotifications]);

  const totalAlertCount = pendingNotifications.length + newTickets.length + unreadPaymentReports.length;
  const markTicketsSeen = () => localStorage.setItem(TICKETS_LAST_SEEN_KEY, new Date().toISOString());

  const filteredSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return visibleModules;
    return visibleModules.filter((m) => m.label.toLowerCase().includes(q));
  }, [searchQuery, visibleModules]);

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  const initials = useMemo(() => {
    if (!currentUser?.name) return "NV";
    const parts = currentUser.name.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  }, [currentUser]);

  const roleLabel = staff ? STAFF_ROLE_LABELS[staff.roleId] : "";

  const renderMenu = (onNavigate?: () => void) => (
    <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
      {visibleModules.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.label === "Dashboard"}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${collapsed ? "xl:justify-center xl:px-2.5" : ""} ${
                isActive ? "bg-[#A96150] text-white shadow-sm" : "text-[#412C20]/80 hover:bg-white hover:text-[#412C20]"
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#412C20]">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] xl:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[82vw] bg-[#FCF7EF] border-r border-[#CEAF75]/10 shadow-xl transition-transform duration-300 xl:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col px-5 py-6">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="relative px-4 py-5 rounded-3xl bg-white border border-[#CEAF75]/10 shadow-sm flex-1 overflow-hidden">
              <img
                src={sidebarBrandArt}
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-35 blur-[1px]"
                style={{ maskImage: "linear-gradient(to top left, black 30%, transparent 85%)", WebkitMaskImage: "linear-gradient(to top left, black 30%, transparent 85%)" }}
              />
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#CEAF75] font-bold mb-3">Tiệm Len Nhỏ</p>
                <h2 className="font-serif font-black text-lg text-[#412C20] leading-tight">Control Panel</h2>
                <p className="mt-2 text-[11px] text-[#412C20]/70">{roleLabel}</p>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full bg-white border border-[#CEAF75]/10 shrink-0" aria-label="Đóng menu">
              <X size={16} />
            </button>
          </div>
          {renderMenu(() => setMobileOpen(false))}
          <button
            onClick={handleLogout}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#E8DDD1] bg-[#FAF6F0] py-2.5 text-[11px] font-semibold hover:bg-white transition"
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden xl:block xl:fixed xl:top-[0px] xl:bottom-0 xl:left-0 z-40 bg-[#FCF7EF] border-r border-[#CEAF75]/10 shadow-sm transition-[width] duration-300 ${
          collapsed ? "xl:w-[84px]" : "xl:w-[260px]"
        }`}
      >
        <div className="h-full flex flex-col px-3.5 py-6 relative">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-white border border-[#CEAF75]/15 shadow-sm flex items-center justify-center hover:bg-[#CEAF75]/10 transition"
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>

          <div className="mb-8 px-1.5">
            <div className={`relative overflow-hidden py-5 rounded-3xl bg-white border border-[#CEAF75]/10 shadow-sm ${collapsed ? "px-2 text-center" : "px-4"}`}>
              {!collapsed && (
                <img
                  src={sidebarBrandArt}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-35 blur-[1px]"
                  style={{ maskImage: "linear-gradient(to top left, black 30%, transparent 85%)", WebkitMaskImage: "linear-gradient(to top left, black 30%, transparent 85%)" }}
                />
              )}
              <div className="relative z-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#CEAF75] font-bold mb-3">{collapsed ? "TLN" : "Tiệm Len Nhỏ"}</p>
                {!collapsed && (
                  <>
                    <h2 className="font-serif font-black text-lg text-[#412C20] leading-tight">Control Panel</h2>
                    <p className="mt-2 text-[11px] text-[#412C20]/70">{roleLabel}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {renderMenu()}

          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#E8DDD1] bg-[#FAF6F0] py-2.5 text-[11px] font-semibold hover:bg-white transition ${
              collapsed ? "w-9 h-9 p-0 mx-auto" : "w-full"
            }`}
          >
            <LogOut size={14} /> {!collapsed && "Đăng xuất"}
          </button>
        </div>
      </div>

      {/* Main column */}
      <div className={`transition-[padding] duration-300 ${collapsed ? "xl:pl-[84px]" : "xl:pl-[260px]"}`}>
        <header className="sticky top-0 z-30 border-b border-[#CEAF75]/10 bg-[#FAF6F0]/95 backdrop-blur-md px-4 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setMobileOpen(true)} className="xl:hidden p-2.5 rounded-full bg-white border border-[#CEAF75]/15 shrink-0" aria-label="Mở menu">
                <Menu size={16} />
              </button>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#CEAF75] font-bold min-w-0">
                  <span className="shrink-0 whitespace-nowrap">Control Panel</span>
                  <ChevronRight size={11} className="text-[#412C20]/30 shrink-0" />
                  <span className="text-[#412C20]/50 truncate min-w-0">{pageTitle}</span>
                  <span className="ml-2 shrink-0 whitespace-nowrap rounded-full bg-[#CEAF75]/15 text-[#CEAF75] px-2 py-0.5 normal-case tracking-normal font-bold text-[10px]">
                    {roleLabel}
                  </span>
                </div>
                <h1 className="font-serif text-xl sm:text-2xl font-black truncate">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center gap-2 bg-white border border-[#CEAF75]/20 rounded-full pl-3.5 pr-2 py-2 shadow-sm">
                    <Search size={14} className="text-[#412C20]/40 shrink-0" />
                    <input
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setSearchOpen(false);
                        if (e.key === "Enter" && filteredSearchResults[0]) handleSearchSelect(filteredSearchResults[0].path);
                      }}
                      placeholder="Tìm module quản trị..."
                      className="w-[128px] sm:w-[192px] text-xs font-sans outline-none bg-transparent placeholder:text-[#412C20]/40"
                    />
                    <button onClick={() => setSearchOpen(false)} className="p-1 text-[#412C20]/40 hover:text-[#412C20]">
                      <X size={13} />
                    </button>
                    {searchQuery && (
                      <div className="absolute top-full mt-2 right-0 w-[256px] bg-white border border-[#CEAF75]/10 rounded-2xl shadow-lg overflow-hidden z-10">
                        {filteredSearchResults.length === 0 ? (
                          <p className="text-xs text-[#412C20]/50 italic p-4">Không tìm thấy module phù hợp.</p>
                        ) : (
                          filteredSearchResults.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button key={item.path} onClick={() => handleSearchSelect(item.path)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-[#CEAF75]/5 transition">
                                <Icon size={14} className="text-[#CEAF75] shrink-0" /> {item.label}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setSearchOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-[#CEAF75]/15 bg-white px-4 py-2 text-xs font-semibold hover:border-[#CEAF75]/30 transition">
                    <Search size={14} /> <span className="hidden sm:inline">Tìm kiếm nhanh</span>
                  </button>
                )}
              </div>

              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); if (!notifOpen) markTicketsSeen(); }}
                  className="relative p-2.5 rounded-full bg-white border border-[#CEAF75]/15 hover:border-[#CEAF75]/30 transition"
                  aria-label="Thông báo"
                >
                  <Bell size={16} />
                  {totalAlertCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#BA1A1A] text-white text-[9px] font-bold flex items-center justify-center">
                      {totalAlertCount > 9 ? "9+" : totalAlertCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute top-full mt-2 right-0 w-[320px] max-w-[85vw] bg-white border border-[#CEAF75]/10 rounded-2xl shadow-lg overflow-hidden z-20">
                    {unreadPaymentReports.length > 0 && (
                      <div className="border-b border-[#CEAF75]/10">
                        <div className="px-4 py-3 flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wide">💰 Khách báo chuyển khoản</p>
                          <span className="text-[10px] font-bold text-[#BA1A1A]">{unreadPaymentReports.length} chưa xử lý</span>
                        </div>
                        <div className="max-h-[180px] overflow-y-auto">
                          {unreadPaymentReports.slice(0, 5).map((n) => (
                            <button
                              key={n.id}
                              onClick={() => {
                                setNotifOpen(false);
                                void markShopNotificationRead(n.id).catch((error) => {
                                  console.warn("[AdminShell] Đánh dấu đã đọc thất bại", error);
                                });
                                navigate("/admin/orders");
                              }}
                              className="w-full px-4 py-2.5 border-t border-[#CEAF75]/5 first:border-0 text-left hover:bg-[#FAF6F0] transition cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold truncate">{n.customerName}</span>
                                <span className="text-[9px] text-[#412C20]/40 font-mono shrink-0">{n.amount.toLocaleString("vi-VN")}đ</span>
                              </div>
                              <p className="text-[11px] text-[#412C20]/70 mt-0.5 line-clamp-1">Đơn {n.orderCode} — kiểm tra tài khoản rồi xác nhận</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {newTickets.length > 0 && (
                      <div className="border-b border-[#CEAF75]/10">
                        <div className="px-4 py-3 flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wide">Ticket hỗ trợ mới</p>
                          <span className="text-[10px] font-bold text-[#BA1A1A]">{newTickets.length} mới</span>
                        </div>
                        <div className="max-h-[180px] overflow-y-auto">
                          {newTickets.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => { setNotifOpen(false); navigate("/admin/tickets"); }}
                              className="w-full px-4 py-2.5 border-t border-[#CEAF75]/5 first:border-0 text-left hover:bg-[#FAF6F0] transition cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold truncate">{t.customerName}</span>
                                <span className="text-[9px] text-[#412C20]/40 font-mono shrink-0">{new Date(t.createdAt).toLocaleDateString("vi-VN")}</span>
                              </div>
                              <p className="text-[11px] text-[#412C20]/70 mt-0.5 line-clamp-1">{t.subject}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="px-4 py-3 border-b border-[#CEAF75]/10 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wide">Thông báo gần đây</p>
                      {pendingNotifications.length > 0 && <span className="text-[10px] font-bold text-[#BA1A1A]">{pendingNotifications.length} đang chờ</span>}
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      {recentNotifications.length === 0 ? (
                        <p className="text-xs text-[#412C20]/50 italic p-5 text-center">Chưa có thông báo nào.</p>
                      ) : (
                        recentNotifications.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => {
                              setNotifOpen(false);
                              navigate("/admin/notifications");
                            }}
                            className="w-full px-4 py-3 border-b border-[#CEAF75]/5 last:border-0 text-left hover:bg-[#FAF6F0] transition cursor-pointer"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold truncate">{n.receiver}</span>
                              <span className="text-[9px] text-[#412C20]/40 font-mono shrink-0">{new Date(n.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                            <p className="text-[11px] text-[#412C20]/70 mt-0.5 line-clamp-2">{n.message}</p>
                          </button>
                        ))
                      )}
                    </div>
                    <button
                      onClick={() => { setNotifOpen(false); navigate("/admin/notifications"); }}
                      className="w-full px-4 py-2.5 text-[11px] font-bold text-center text-[#CEAF75] hover:bg-[#FAF6F0] transition cursor-pointer border-t border-[#CEAF75]/10"
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                )}
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                  className="flex items-center gap-2 rounded-full bg-white border border-[#CEAF75]/15 pl-1 pr-3 py-1 hover:border-[#CEAF75]/30 transition"
                >
                  <span className="w-7 h-7 rounded-full bg-[#CEAF75]/15 text-[#CEAF75] font-bold text-[11px] flex items-center justify-center font-serif">{initials}</span>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[110px] truncate">{currentUser?.name}</span>
                  <ChevronDown size={13} className="text-[#412C20]/40" />
                </button>
                {profileOpen && (
                  <div className="absolute top-full mt-2 right-0 w-56 bg-white border border-[#CEAF75]/10 rounded-2xl shadow-lg overflow-hidden z-20">
                    <div className="px-4 py-3 border-b border-[#CEAF75]/10">
                      <p className="text-xs font-bold truncate">{currentUser?.name}</p>
                      <p className="text-[10px] text-[#412C20]/50">{roleLabel}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-left text-[#BA1A1A] hover:bg-red-50 transition">
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  </div>
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
