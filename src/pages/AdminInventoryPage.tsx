import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Package, AlertTriangle, Download, Upload, Archive, Clock, ListChecks } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminInventoryPage() {
  const { productVariants, inventoryLogs, adjustVariantStock } = useApp();
  const [search, setSearch] = useState("");
  const [variantId, setVariantId] = useState<string>("");
  const [adjustQty, setAdjustQty] = useState<number>(0);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return productVariants.filter((variant) =>
      variant.productName.toLowerCase().includes(query) || variant.color.toLowerCase().includes(query) || variant.sku.toLowerCase().includes(query)
    );
  }, [productVariants, search]);

  const lowStockCount = productVariants.filter((v) => v.stockQuantity <= 5 && v.stockQuantity > 0).length;
  const totalVariants = productVariants.length;
  const totalStockValue = productVariants.reduce((sum, variant) => sum + variant.stockQuantity * variant.price, 0);
  const lastImport = inventoryLogs.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.createdAt;

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Quản lý kho</span>
          <h1 className="font-serif text-3xl font-black text-brand-fb">Tình trạng tồn kho và lịch sử nhập xuất</h1>
          <p className="text-sm text-brand-fb/70 max-w-2xl">Theo dõi biến thể sản phẩm, cảnh báo low-stock và điều chỉnh tồn kho ngay trong giao diện admin.</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-end">
          <button className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-[#8c4a3f] transition">
            <Download size={16} /> Xuất báo cáo
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-fb hover:bg-brand-primary/5 transition">
            <Upload size={16} /> Nhập kho mới
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Tổng tồn kho</span>
          <p className="mt-4 text-3xl font-mono font-black text-brand-fb">{totalStockValue.toLocaleString("vi-VN")}đ</p>
          <p className="mt-2 text-sm text-brand-fb/60">Giá trị sản phẩm còn lại trong kho.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Sản phẩm sắp hết</span>
          <p className="mt-4 text-3xl font-mono font-black text-brand-fb">{lowStockCount}</p>
          <p className="mt-2 text-sm text-brand-fb/60">Biến thể cần bổ sung sớm.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Giá trị tồn kho</span>
          <p className="mt-4 text-3xl font-mono font-black text-brand-fb">{totalVariants}</p>
          <p className="mt-2 text-sm text-brand-fb/60">Số biến thể hiện có.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Lần nhập kho cuối</span>
          <p className="mt-4 text-3xl font-mono font-black text-brand-fb">{lastImport ? new Date(lastImport).toLocaleDateString("vi-VN") : "Chưa có"}</p>
          <p className="mt-2 text-sm text-brand-fb/60">Cập nhật mới nhất từ lịch sử kho.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Tìm biến thể</span>
              <p className="text-sm text-brand-fb/60">Tìm theo tên, màu hoặc SKU.</p>
            </div>
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <input
            className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
            placeholder="Nhập từ khoá..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
                <tr>
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Màu sắc</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Chất liệu</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Tồn kho</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/10">
                {filtered.map((variant) => (
                  <tr key={variant.id} className="hover:bg-white transition-colors">
                    <td className="px-4 py-4 text-brand-fb">{variant.productName}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{variant.color}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{variant.size}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{variant.material}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{variant.sku}</td>
                    <td className="px-4 py-4 font-mono text-brand-fb">{variant.stockQuantity}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${variant.status === "out-of-stock" ? "bg-red-50 text-red-600" : variant.status === "low-stock" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                        {variant.status === "out-of-stock" ? "Hết hàng" : variant.status === "low-stock" ? "Sắp hết" : "Còn hàng"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-[0.24em] mb-4">
            <Archive size={16} /> Điều chỉnh tồn kho
          </div>
          <p className="text-sm text-brand-fb/70 mb-5">Nhập mã biến thể và giá trị thay đổi để cập nhật tồn kho.</p>
          <div className="space-y-4">
            <input
              className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Variant ID..."
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
            />
            <input
              type="number"
              className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Số lượng điều chỉnh..."
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
            />
            <button
              onClick={() => {
                if (!variantId || adjustQty === 0) return;
                adjustVariantStock(variantId, adjustQty, "Điều chỉnh thủ công admin");
                setVariantId("");
                setAdjustQty(0);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#8c4a3f] transition"
            >
              <Package size={16} /> Cập nhật tồn kho
            </button>
          </div>
        </div>
      </div>

      <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Nhật ký kho</span>
            <p className="text-sm text-brand-fb/60">Lịch sử nhập xuất và điều chỉnh tồn kho.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-bg px-4 py-2 text-[11px] font-semibold text-brand-fb border border-brand-primary/10">
            <Clock size={14} /> Cập nhật gần nhất
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.24em] text-brand-fb/60">
              <tr>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Biến thể</th>
                <th className="px-4 py-3">Thay đổi</th>
                <th className="px-4 py-3">Trước / Sau</th>
                <th className="px-4 py-3">Lý do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-primary/10">
              {inventoryLogs.slice(0, 8).map((log) => (
                <tr key={log.id} className="hover:bg-white transition-colors">
                  <td className="px-4 py-4 font-mono text-brand-fb/70">{new Date(log.createdAt).toLocaleString("vi-VN")}</td>
                  <td className="px-4 py-4 text-brand-fb">{log.productName}</td>
                  <td className="px-4 py-4 text-brand-fb/70">{log.color} · {log.size}</td>
                  <td className="px-4 py-4 text-brand-fb">{log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}</td>
                  <td className="px-4 py-4 text-brand-fb/70">{log.previousStock} → {log.newStock}</td>
                  <td className="px-4 py-4 text-brand-fb/70">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
