import { useMemo, useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Search, ShoppingBag, Filter, Plus, Edit3, Trash2, MoreHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";

export default function AdminProductsPage() {
  const { productsList, setProductsList } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Túi len handmade");
  const [newPrice, setNewPrice] = useState(180000);

  const categories = [
    "Tất cả",
    "Áo len thủ công",
    "Khăn len",
    "Phụ kiện len",
    "Túi len handmade",
    "Móc khóa len",
    "Đồ trang trí handmade",
    "Quà tặng handmade"
  ];

  const filtered = useMemo(() => {
    return productsList.filter((product) => {
      const query = search.toLowerCase();
      const matchSearch = product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      const matchCategory = category === "Tất cả" || product.category === category;
      return matchSearch && matchCategory;
    });
  }, [productsList, search, category]);

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: newName,
      price: newPrice,
      rating: 5,
      reviewsCount: 0,
      badge: "Mới",
      image: "https://images.unsplash.com/photo-1517242046021-82ee19d4a410?auto=format&fit=crop&q=80&w=400",
      category: newCategory,
      description: "Sản phẩm len handmade mới vừa nhập xưởng.",
      material: "Cotton mềm mại",
      colors: [{ name: "Kem", hex: "#FFF8F0" }],
      sizes: ["Tiêu chuẩn"],
      materials: [{ name: "Cotton mềm", priceModifier: 0 }],
      stock: 30
    };
    setProductsList((prev) => [newProduct, ...prev]);
    setNewName("");
    setNewPrice(180000);
    setShowForm(false);
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Quản lý sản phẩm</span>
          <h1 className="font-serif text-3xl font-black text-brand-fb">Danh sách sản phẩm Tiệm Len Nhỏ</h1>
          <p className="text-sm text-brand-fb/70 max-w-2xl">Tìm kiếm, lọc và quản lý bảng sản phẩm, tồn kho và trạng thái sản phẩm hand-made.</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-[#9b4d3f] transition"
        >
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      {showForm && (
        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} className="bg-brand-card border border-brand-primary/10 rounded-[32px] p-6 shadow-sm">
          <form onSubmit={handleAddProduct} className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.24em] text-brand-fb/60 mb-2">Tên sản phẩm</label>
              <input
                className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.24em] text-brand-fb/60 mb-2">Danh mục</label>
              <select
                className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {categories.filter((item) => item !== "Tất cả").map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.24em] text-brand-fb/60 mb-2">Giá cơ bản (VND)</label>
              <input
                type="number"
                className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
              />
            </div>
            <div className="lg:col-span-3 flex flex-col gap-3 pt-1">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#A96150] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#8c4a3f] transition">
                <Plus size={15} /> Lưu sản phẩm mới
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Tổng sản phẩm</span>
          <p className="mt-4 text-3xl font-mono font-black text-brand-fb">{productsList.length}</p>
          <p className="mt-2 text-sm text-brand-fb/60">Các sản phẩm len đang trưng bày và quản lý.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Danh mục chọn</span>
          <p className="mt-4 text-3xl font-mono font-black text-brand-fb">{category}</p>
          <p className="mt-2 text-sm text-brand-fb/60">Bộ lọc danh mục hiện tại.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-bold">Sản phẩm hiển thị</span>
          <p className="mt-4 text-3xl font-mono font-black text-brand-fb">{filtered.length}</p>
          <p className="mt-2 text-sm text-brand-fb/60">Kết quả tìm kiếm theo từ khóa và bộ lọc.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Tìm sản phẩm</p>
              <p className="text-sm text-brand-fb/60">Nhập tên hoặc mô tả.</p>
            </div>
            <Search size={18} className="text-brand-primary" />
          </div>
          <input
            className="w-full rounded-2xl border border-brand-primary/15 bg-white px-4 py-3 text-sm text-brand-fb outline-none focus:border-brand-primary"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold mb-3">Bộ lọc danh mục</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === item ? "bg-brand-primary text-white" : "bg-white border border-brand-primary/10 text-brand-fb/80 hover:bg-brand-primary/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[32px] border border-brand-primary/10 bg-brand-card shadow-sm">
        <table className="min-w-full divide-y divide-brand-primary/10 text-left text-sm">
          <thead className="bg-[#F4EFE6] text-[11px] uppercase tracking-[0.18em] text-brand-fb/70">
            <tr>
              <th className="px-5 py-4">Sản phẩm</th>
              <th className="px-5 py-4">Danh mục</th>
              <th className="px-5 py-4">Giá</th>
              <th className="px-5 py-4">Kho</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-primary/10">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-white transition-colors">
                <td className="px-5 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <img src={product.image} alt={product.name} className="w-20 h-20 rounded-2xl object-cover border border-brand-primary/10" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-semibold text-brand-fb">{product.name}</p>
                      <p className="text-[11px] text-brand-fb/50">{product.description.slice(0, 60)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-brand-fb/70">{product.category}</td>
                <td className="px-5 py-4 align-top font-mono text-brand-fb">{product.price.toLocaleString("vi-VN")}đ</td>
                <td className="px-5 py-4 align-top text-brand-fb/70">{product.stock}</td>
                <td className="px-5 py-4 align-top">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold ${product.stock === 0 ? "bg-red-50 text-red-600" : product.stock <= 5 ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                    {product.stock === 0 ? "Hết hàng" : product.stock <= 5 ? "Sắp hết" : "Đang bán"}
                  </span>
                </td>
                <td className="px-5 py-4 align-top flex gap-2">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/15 px-3 py-2 text-[11px] text-brand-fb font-semibold hover:bg-brand-primary/5 transition">
                    <Edit3 size={14} /> Sửa
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white border border-red-100 px-3 py-2 text-[11px] text-red-600 font-semibold hover:bg-red-50 transition">
                    <Trash2 size={14} /> Xóa
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/15 px-3 py-2 text-[11px] text-brand-fb font-semibold hover:bg-brand-primary/5 transition">
                    <MoreHorizontal size={14} /> Khác
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
