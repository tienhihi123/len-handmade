import { useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
  Search
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
  { label: "Blog / Tin tức", path: "/admin/blog", icon: FileText },
  { label: "Tài liệu kỹ thuật", path: "/admin/docs", icon: BookOpen },
  { label: "Cài đặt", path: "/admin/settings", icon: Settings }
];

export default function AdminLayout() {
  const { currentUser, logoutUser } = useApp();
  const navigate = useNavigate();

  const userTitle = useMemo(() => {
    if (!currentUser) return "Quản trị viên";
    return `${currentUser.name}`;
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-fb">
      <div className="xl:fixed xl:inset-y-0 xl:left-0 xl:w-[260px] bg-[#FCF7EF] border-r border-brand-primary/10 shadow-sm">
        <div className="h-full flex flex-col px-5 py-6">
          <div className="mb-8">
            <div className="px-4 py-5 rounded-3xl bg-white border border-brand-primary/10 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-primary font-bold mb-3">Len Admin</p>
              <h2 className="font-serif font-black text-xl text-brand-fb leading-tight">Store Manager</h2>
              <p className="mt-3 text-[11px] text-brand-fb/70">Giao diện quản lý dành cho {BRAND_NAME}.</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto pr-1 space-y-1">
            {adminMenu.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#A96150] text-white shadow-sm"
                        : "text-brand-fb/80 hover:bg-white hover:text-brand-fb"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 px-4 py-5 rounded-3xl bg-white border border-brand-primary/10 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-primary mb-3">Tài khoản</p>
            <p className="font-sans text-sm font-semibold text-brand-fb">{userTitle}</p>
            <p className="text-[11px] text-brand-fb/60 mt-2">Vai trò: Quản trị viên</p>
            <button
              onClick={() => {
                logoutUser();
                navigate("/login");
              }}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full border border-brand-primary/10 bg-brand-bg py-2 text-[11px] text-brand-fb font-semibold hover:bg-white transition"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="xl:pl-[260px]">
        <header className="sticky top-0 z-40 border-b border-brand-primary/10 bg-[#FAF6F0]/95 backdrop-blur-md px-4 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Admin Console</p>
              <h1 className="font-serif text-2xl font-black text-brand-fb">{BRAND_NAME} Control Panel</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-brand-primary/15 bg-white px-4 py-2 text-xs font-semibold text-brand-fb transition hover:border-brand-primary/30">
                <Search size={14} /> Tìm kiếm nhanh
              </button>
              <div className="rounded-full bg-white border border-brand-primary/10 px-4 py-2 text-xs text-brand-fb font-semibold">
                Online
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
