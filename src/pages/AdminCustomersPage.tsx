import { useMemo, useState } from "react";
import { Search, Users, Mail, Phone, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminCustomersPage() {
  const { customersList } = useApp();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return customersList.filter((customer) =>
      customer.fullName.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.email.toLowerCase().includes(query)
    );
  }, [customersList, search]);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Quản lý khách hàng</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Hồ sơ và lịch sử khách hàng</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Tra cứu khách hàng, địa chỉ liên hệ, và hành trình mua hàng của từng khách.</p>
      </div>

      <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Tìm kiếm khách hàng</p>
            <p className="text-sm text-brand-fb/60">Tìm theo tên, số điện thoại hoặc email.</p>
          </div>
          <div className="relative w-full lg:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fb/50" />
            <input
              className="w-full rounded-3xl border border-brand-primary/15 bg-white pl-10 pr-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Tìm khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Tổng khách hàng</p>
          <p className="mt-4 text-4xl font-mono font-black text-brand-fb">{customersList.length}</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Tổng đơn</p>
          <p className="mt-4 text-4xl font-mono font-black text-brand-fb">{customersList.reduce((sum, customer) => sum + customer.totalOrders, 0)}</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Tổng chi tiêu</p>
          <p className="mt-4 text-4xl font-mono font-black text-brand-fb">{customersList.reduce((sum, customer) => sum + customer.totalSpent, 0).toLocaleString("vi-VN")}đ</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-brand-primary/10 bg-brand-card shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4EFE6] text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
            <tr>
              <th className="px-4 py-4">Khách hàng</th>
              <th className="px-4 py-4">Số điện thoại</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Địa chỉ</th>
              <th className="px-4 py-4">Tổng đơn</th>
              <th className="px-4 py-4">Tổng chi tiêu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/10">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-white transition-colors">
                <td className="px-4 py-4 text-brand-fb font-semibold">{customer.fullName}</td>
                <td className="px-4 py-4 text-brand-fb/70">{customer.phone}</td>
                <td className="px-4 py-4 text-brand-fb/70">{customer.email}</td>
                <td className="px-4 py-4 text-brand-fb/70">{customer.address}</td>
                <td className="px-4 py-4 text-brand-fb font-bold">{customer.totalOrders}</td>
                <td className="px-4 py-4 text-brand-fb font-mono">{customer.totalSpent.toLocaleString("vi-VN")}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
