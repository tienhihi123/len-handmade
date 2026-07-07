import { useMemo, useRef, useState, ChangeEvent } from "react";
import { motion } from "motion/react";
import { Package, AlertTriangle, Download, Upload, Archive, Clock, ListChecks, Layers, AlertCircle, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { ProductVariant } from "../types";

const STATUS_LABEL: Record<ProductVariant["status"], string> = {
  "in-stock": "Còn hàng",
  "low-stock": "Sắp hết",
  "out-of-stock": "Hết hàng"
};
const STATUS_FROM_LABEL: Record<string, ProductVariant["status"]> = {
  "còn hàng": "in-stock",
  "sắp hết": "low-stock",
  "hết hàng": "out-of-stock"
};
const EXPORT_HEADERS = ["Sản phẩm", "Màu sắc", "Size", "Chất liệu", "SKU", "Tồn kho", "Trạng thái"];

export default function AdminInventoryPage() {
  const { productVariants, inventoryLogs, adjustVariantStock } = useApp();
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "multi-variant" | "low-stock">("all");
  const [variantId, setVariantId] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustError, setAdjustError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const variantCountByProduct = useMemo(() => {
    const map = new Map<string, number>();
    productVariants.forEach((v) => map.set(v.productId, (map.get(v.productId) || 0) + 1));
    return map;
  }, [productVariants]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return productVariants.filter((variant) => {
      const matchesQuery =
        variant.productName.toLowerCase().includes(query) || variant.color.toLowerCase().includes(query) || variant.sku.toLowerCase().includes(query);
      if (!matchesQuery) return false;
      if (quickFilter === "multi-variant") return (variantCountByProduct.get(variant.productId) || 0) > 1;
      if (quickFilter === "low-stock") return variant.status === "low-stock" || variant.status === "out-of-stock";
      return true;
    });
  }, [productVariants, search, quickFilter, variantCountByProduct]);

  const selectedVariant = useMemo(
    () => productVariants.find((v) => v.id === selectedVariantId),
    [productVariants, selectedVariantId]
  );

  const handleSelectVariant = (variantIdToSelect: string) => {
    const variant = productVariants.find((v) => v.id === variantIdToSelect);
    if (!variant) return;
    setSelectedVariantId(variant.id);
    setVariantId(variant.sku);
    setAdjustQty(0);
    setAdjustError("");
  };

  const handleUpdateStock = () => {
    setAdjustError("");
    const query = variantId.trim();
    if (!query || adjustQty === 0) {
      setAdjustError("Vui lòng chọn biến thể và nhập số lượng thay đổi khác 0.");
      return;
    }
    // Resolve the typed value against SKU first (what admins actually see), then fall back to raw id.
    const resolved =
      productVariants.find((v) => v.id === selectedVariantId) ||
      productVariants.find((v) => v.sku.toLowerCase() === query.toLowerCase()) ||
      productVariants.find((v) => v.id === query);

    if (!resolved) {
      setAdjustError("Không tìm thấy biến thể khớp với mã SKU/ID này.");
      return;
    }

    adjustVariantStock(resolved.id, adjustQty, "Điều chỉnh thủ công admin");
    setVariantId("");
    setSelectedVariantId("");
    setAdjustQty(0);
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Tiệm Len Nhỏ";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet("Tồn kho", {
        views: [{ state: "frozen", ySplit: 1 }]
      });

      sheet.columns = [
        { header: "Sản phẩm", key: "productName", width: 32 },
        { header: "Màu sắc", key: "color", width: 18 },
        { header: "Size", key: "size", width: 16 },
        { header: "Chất liệu", key: "material", width: 26 },
        { header: "SKU", key: "sku", width: 18 },
        { header: "Tồn kho", key: "stockQuantity", width: 12 },
        { header: "Trạng thái", key: "status", width: 16 }
      ];

      productVariants.forEach((v) => {
        sheet.addRow({
          productName: v.productName,
          color: v.color,
          size: v.size,
          material: v.material,
          sku: v.sku,
          stockQuantity: v.stockQuantity,
          status: STATUS_LABEL[v.status]
        });
      });

      const headerRow = sheet.getRow(1);
      headerRow.height = 24;
      headerRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFA96150" } };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "FFD9C7B8" } },
          bottom: { style: "thin", color: { argb: "FFD9C7B8" } },
          left: { style: "thin", color: { argb: "FFD9C7B8" } },
          right: { style: "thin", color: { argb: "FFD9C7B8" } }
        };
      });

      const statusFill: Record<ProductVariant["status"], string> = {
        "in-stock": "FFE6F2E6",
        "low-stock": "FFFCEFD9",
        "out-of-stock": "FFFBE3E1"
      };
      const statusFont: Record<ProductVariant["status"], string> = {
        "in-stock": "FF2E7D32",
        "low-stock": "FF9A6300",
        "out-of-stock": "FFBA1A1A"
      };

      productVariants.forEach((v, idx) => {
        const row = sheet.getRow(idx + 2);
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFEFE7DB" } },
            bottom: { style: "thin", color: { argb: "FFEFE7DB" } },
            left: { style: "thin", color: { argb: "FFEFE7DB" } },
            right: { style: "thin", color: { argb: "FFEFE7DB" } }
          };
          cell.alignment = { vertical: "middle", horizontal: colNumber === 6 ? "center" : "left" };
          if (idx % 2 === 1) {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFAF6F0" } };
          }
        });
        const statusCell = row.getCell(7);
        statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: statusFill[v.status] } };
        statusCell.font = { bold: true, color: { argb: statusFont[v.status] } };
        statusCell.alignment = { vertical: "middle", horizontal: "center" };
      });

      sheet.autoFilter = { from: "A1", to: "G1" };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `ton-kho-tiem-len-nho-${today}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportMessage(null);

    try {
      const ExcelJS = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);
      const sheet = workbook.worksheets[0];
      if (!sheet) throw new Error("Không tìm thấy sheet dữ liệu trong file.");

      const headerRow = sheet.getRow(1);
      const headerValues = (headerRow.values as unknown[]).slice(1).map((v) => String(v || "").trim());
      const skuCol = headerValues.findIndex((h) => h === "SKU") + 1;
      const stockCol = headerValues.findIndex((h) => h === "Tồn kho") + 1;
      const statusCol = headerValues.findIndex((h) => h === "Trạng thái") + 1;

      if (!skuCol || !stockCol) {
        throw new Error(`File cần có đủ cột: ${EXPORT_HEADERS.join(", ")}.`);
      }

      let updatedCount = 0;
      let notFoundCount = 0;

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const sku = String(row.getCell(skuCol).value || "").trim();
        if (!sku) return;
        const newStockRaw = row.getCell(stockCol).value;
        const newStock = typeof newStockRaw === "number" ? newStockRaw : Number(newStockRaw);
        if (!Number.isFinite(newStock)) return;

        const variant = productVariants.find((v) => v.sku.toLowerCase() === sku.toLowerCase());
        if (!variant) {
          notFoundCount += 1;
          return;
        }

        const delta = newStock - variant.stockQuantity;
        if (delta !== 0) {
          adjustVariantStock(variant.id, delta, `Nhập từ file: ${file.name}`);
          updatedCount += 1;
        }
        void statusCol; // status column is informational; stock quantity drives status recompute
      });

      setImportMessage({
        type: "success",
        text: `Đã cập nhật ${updatedCount} biến thể từ file "${file.name}".${notFoundCount > 0 ? ` (${notFoundCount} mã SKU không khớp bị bỏ qua.)` : ""}`
      });
    } catch (err: any) {
      setImportMessage({ type: "error", text: err?.message || "Không thể đọc file. Vui lòng dùng file đã xuất từ hệ thống." });
    }
  };

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
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-[#8c4a3f] transition disabled:opacity-60 cursor-pointer"
          >
            {isExporting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Xuất báo cáo
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleImportFileSelected}
          />
          <button
            onClick={() => importInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-fb hover:bg-brand-primary/5 transition cursor-pointer"
          >
            <Upload size={16} /> Nhập kho mới
          </button>
        </div>
      </div>

      {importMessage && (
        <div
          className={`flex items-start gap-2.5 rounded-2xl px-5 py-4 text-sm font-semibold ${
            importMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {importMessage.type === "success" ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
          <span>{importMessage.text}</span>
        </div>
      )}

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
              <p className="text-sm text-brand-fb/60">Tìm theo tên, màu hoặc SKU. Nhấn một dòng để điều chỉnh.</p>
            </div>
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Nhập từ khoá..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setQuickFilter((prev) => (prev === "multi-variant" ? "all" : "multi-variant"))}
                title="Sản phẩm có nhiều biến thể"
                className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-3 text-xs font-semibold transition ${
                  quickFilter === "multi-variant"
                    ? "bg-brand-primary border-brand-primary text-white"
                    : "bg-white border-brand-primary/15 text-brand-fb hover:border-brand-primary/30"
                }`}
              >
                <Layers size={14} />
              </button>
              <button
                type="button"
                onClick={() => setQuickFilter((prev) => (prev === "low-stock" ? "all" : "low-stock"))}
                title="Sắp hết / hết hàng"
                className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-3 text-xs font-semibold transition ${
                  quickFilter === "low-stock"
                    ? "bg-amber-600 border-amber-600 text-white"
                    : "bg-white border-brand-primary/15 text-brand-fb hover:border-brand-primary/30"
                }`}
              >
                <AlertCircle size={14} />
              </button>
            </div>
          </div>
          {quickFilter !== "all" && (
            <p className="mt-2 text-[11px] text-brand-primary font-semibold">
              {quickFilter === "multi-variant" ? "Đang lọc: sản phẩm có nhiều biến thể" : "Đang lọc: sắp hết / hết hàng"}
            </p>
          )}
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
                  <tr
                    key={variant.id}
                    onClick={() => handleSelectVariant(variant.id)}
                    className={`cursor-pointer transition-colors ${selectedVariantId === variant.id ? "bg-brand-primary/10" : "hover:bg-white"}`}
                  >
                    <td className="px-4 py-4 text-brand-fb">{variant.productName}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{variant.color}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{variant.size}</td>
                    <td className="px-4 py-4 text-brand-fb/70">{variant.material}</td>
                    <td className="px-4 py-4 text-brand-fb/70 font-mono">{variant.sku}</td>
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
          <p className="text-sm text-brand-fb/70 mb-5">Nhấn một dòng trong bảng biến thể, hoặc nhập mã SKU và giá trị thay đổi để cập nhật tồn kho.</p>
          {selectedVariant && (
            <div className="mb-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/15 px-4 py-3 text-xs text-brand-fb">
              <p className="font-semibold">{selectedVariant.productName}</p>
              <p className="text-brand-fb/60">{selectedVariant.color} · {selectedVariant.size} · Tồn kho hiện tại: <strong className="font-mono">{selectedVariant.stockQuantity}</strong></p>
            </div>
          )}
          <div className="space-y-4">
            <input
              list="variant-sku-suggestions"
              className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Nhập mã SKU..."
              value={variantId}
              onChange={(e) => {
                setVariantId(e.target.value);
                setSelectedVariantId("");
              }}
            />
            <datalist id="variant-sku-suggestions">
              {productVariants.map((v) => (
                <option key={v.id} value={v.sku}>{v.productName} — {v.color}</option>
              ))}
            </datalist>
            <input
              type="number"
              className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
              placeholder="Số lượng điều chỉnh..."
              value={adjustQty}
              onChange={(e) => setAdjustQty(Number(e.target.value))}
            />
            {adjustError && <p className="text-[11px] text-red-600 font-semibold">{adjustError}</p>}
            <button
              onClick={handleUpdateStock}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#8c4a3f] transition cursor-pointer"
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
