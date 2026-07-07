import { useMemo } from "react";
import { Box, PackageCheck, PackageX, AlertTriangle, Layers, ImageOff } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function ProductsDashboardPage() {
  const { productsList, inventoryLogs, topProducts } = useApp();

  const active = productsList.filter((p) => p.stock > 5).length;
  const outOfStock = productsList.filter((p) => p.stock === 0).length;
  const lowStock = productsList.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    productsList.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + p.stock));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [productsList]);

  const incomplete = productsList.filter((p) => !p.description || p.description.length < 30 || !p.image);

  const cards = [
    { label: "Tổng sản phẩm", value: productsList.length, icon: Box },
    { label: "Sản phẩm active", value: active, icon: PackageCheck },
    { label: "Sản phẩm hết hàng", value: outOfStock, icon: PackageX },
    { label: "Sản phẩm sắp hết", value: lowStock, icon: AlertTriangle }
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Dashboard sản phẩm</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20]">Quản lý sản phẩm và kho</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] shadow-sm space-y-1.5">
              <span className="text-[10px] text-[#75645A] uppercase font-bold">{c.label}</span>
              <div className="flex items-center justify-between">
                <strong className="text-xl font-mono font-black text-[#412C20]">{c.value}</strong>
                <Icon className="text-[#CEAF75]" size={18} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <Layers size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Tồn kho theo danh mục</h4>
          </div>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {byCategory.map(([cat, stock]) => (
              <div key={cat} className="flex justify-between items-center text-xs bg-[#FAF6F0] p-2.5 rounded-lg">
                <span className="font-semibold">{cat}</span>
                <span className="font-mono font-bold text-[#CEAF75]">{stock} cuộn</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <PackageCheck size={15} className="text-[#CEAF75]" />
            <h4 className="font-serif font-bold text-xs uppercase">Giao dịch kho gần đây</h4>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {inventoryLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex justify-between items-center text-xs bg-[#FAF6F0] p-2.5 rounded-lg">
                <div>
                  <strong>{log.productName}</strong>
                  <p className="text-[10px] text-[#75645A]">{log.reason}</p>
                </div>
                <span className={`font-mono font-bold ${log.quantityChanged < 0 ? "text-red-600" : "text-green-600"}`}>
                  {log.quantityChanged > 0 ? `+${log.quantityChanged}` : log.quantityChanged}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <h4 className="font-serif font-bold text-xs uppercase border-b border-[#E8DDD1] pb-3">Sản phẩm bán chạy</h4>
          <div className="space-y-2">
            {topProducts.slice(0, 6).map((p) => (
              <div key={p.productId} className="flex justify-between items-center text-xs bg-[#FAF6F0] p-2.5 rounded-lg">
                <span className="font-semibold">{p.productName}</span>
                <span className="font-mono text-[#CEAF75] font-bold">{p.totalSold} đã bán</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DDD1] p-6 space-y-3">
          <div className="flex items-center gap-1.5 border-b border-[#E8DDD1] pb-3">
            <ImageOff size={15} className="text-[#BA1A1A]" />
            <h4 className="font-serif font-bold text-xs uppercase">Thiếu ảnh / thông tin ({incomplete.length})</h4>
          </div>
          {incomplete.length === 0 ? (
            <p className="text-xs text-[#75645A] italic py-4 text-center">Tất cả sản phẩm đã đầy đủ thông tin.</p>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {incomplete.slice(0, 8).map((p) => (
                <div key={p.id} className="text-xs bg-red-50 text-red-700 px-3 py-2 rounded-lg font-semibold">{p.name}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
