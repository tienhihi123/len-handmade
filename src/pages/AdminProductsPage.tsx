import { Fragment, useMemo, useState, FormEvent } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Filter, Plus, Edit3, Trash2, MoreHorizontal, Copy, ExternalLink, X, Check, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";
import { updateProductFieldsInFirestore } from "../lib/firestoreProducts";

const STATUS_OPTIONS: { label: string; stock: number }[] = [
  { label: "Đang bán", stock: 20 },
  { label: "Sắp hết", stock: 3 },
  { label: "Hết hàng", stock: 0 }
];

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { productsList, setProductsList, categoriesList, productVariants } = useApp();
  const [syncedId, setSyncedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [category, setCategory] = useState("Tất cả");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [qtyMin, setQtyMin] = useState("");
  const [qtyMax, setQtyMax] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "selling" | "low" | "out">("all");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Túi len handmade");
  const [newPrice, setNewPrice] = useState(180000);

  // Row-level action states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);

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
    const min = priceMin ? Number(priceMin) : null;
    const max = priceMax ? Number(priceMax) : null;
    const qMin = qtyMin ? Number(qtyMin) : null;
    const qMax = qtyMax ? Number(qtyMax) : null;
    return productsList.filter((product) => {
      const query = search.toLowerCase();
      const matchSearch = product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
      const matchCategory = category === "Tất cả" || product.category === category;
      const matchPrice = (min === null || product.price >= min) && (max === null || product.price <= max);
      const matchQty = (qMin === null || product.stock >= qMin) && (qMax === null || product.stock <= qMax);
      const matchStatus =
        stockFilter === "all" ||
        (stockFilter === "out" && product.stock === 0) ||
        (stockFilter === "low" && product.stock > 0 && product.stock <= 5) ||
        (stockFilter === "selling" && product.stock > 5);
      return matchSearch && matchCategory && matchPrice && matchQty && matchStatus;
    });
  }, [productsList, search, category, priceMin, priceMax, qtyMin, qtyMax, stockFilter]);

  const searchSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return productsList.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
  }, [productsList, search]);

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

  const handleStartEdit = (product: Product) => {
    setOpenMenuId(null);
    setOpenStatusId(null);
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingId || !editName.trim()) return;
    setProductsList((prev) =>
      prev.map((p) => (p.id === editingId ? { ...p, name: editName, price: editPrice } : p))
    );
    updateProductFieldsInFirestore(editingId, { name: editName, price: editPrice });
    setEditingId(null);
  };

  // Category and stock are owned by AdminCategoriesPage / AdminInventoryPage
  // and already stream live via context — this just re-derives them from
  // those sources for this row, confirming nothing has drifted.
  const handleSyncCategoryAndStock = (product: Product) => {
    const liveCategory = categoriesList.find((c) => c.name === product.category)?.name ?? product.category;
    const liveStock = productVariants
      .filter((v) => v.productId === product.id)
      .reduce((sum, v) => sum + v.stockQuantity, 0);
    setProductsList((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, category: liveCategory, stock: liveStock || p.stock } : p))
    );
    updateProductFieldsInFirestore(product.id, { category: liveCategory, stock: liveStock || product.stock });
    setSyncedId(product.id);
    setTimeout(() => setSyncedId((prev) => (prev === product.id ? null : prev)), 1500);
  };

  const handleDeleteProduct = (product: Product) => {
    setOpenMenuId(null);
    if (!window.confirm(`Xóa sản phẩm "${product.name}" khỏi danh sách?`)) return;
    setProductsList((prev) => prev.filter((p) => p.id !== product.id));
  };

  const handleDuplicateProduct = (product: Product) => {
    setOpenMenuId(null);
    const duplicated: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      name: `${product.name} (Bản sao)`
    };
    setProductsList((prev) => [duplicated, ...prev]);
  };

  const handleSetStatus = (product: Product, stock: number) => {
    setOpenStatusId(null);
    setProductsList((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock } : p)));
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
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm relative">
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
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && search.trim() && (
            <div className="absolute left-5 right-5 top-full mt-1.5 bg-white border border-brand-primary/10 rounded-2xl shadow-lg overflow-hidden z-20">
              {searchSuggestions.length === 0 ? (
                <p className="text-xs text-brand-fb/50 italic p-4">Không tìm thấy gợi ý phù hợp.</p>
              ) : (
                searchSuggestions.map((p) => (
                  <button
                    key={p.id}
                    onMouseDown={() => setSearch(p.name)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-left hover:bg-brand-primary/5 transition"
                  >
                    <img src={p.image} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                    <span className="truncate text-brand-fb font-semibold">{p.name}</span>
                    <span className="ml-auto shrink-0 font-mono text-brand-primary">{p.price.toLocaleString("vi-VN")}đ</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold mb-3">Lọc danh mục</p>
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

        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-5 shadow-sm space-y-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Lọc giá, số lượng &amp; trạng thái</p>

          <div>
            <p className="text-[10px] text-brand-fb/50 font-semibold mb-1.5">Khoảng giá (VND)</p>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Từ" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-full rounded-xl border border-brand-primary/15 bg-white px-3 py-2 text-xs text-brand-fb outline-none focus:border-brand-primary" />
              <span className="text-brand-fb/30 text-xs">—</span>
              <input type="number" placeholder="Đến" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full rounded-xl border border-brand-primary/15 bg-white px-3 py-2 text-xs text-brand-fb outline-none focus:border-brand-primary" />
            </div>
          </div>

          <div>
            <p className="text-[10px] text-brand-fb/50 font-semibold mb-1.5">Số lượng tồn kho</p>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Từ" value={qtyMin} onChange={(e) => setQtyMin(e.target.value)} className="w-full rounded-xl border border-brand-primary/15 bg-white px-3 py-2 text-xs text-brand-fb outline-none focus:border-brand-primary" />
              <span className="text-brand-fb/30 text-xs">—</span>
              <input type="number" placeholder="Đến" value={qtyMax} onChange={(e) => setQtyMax(e.target.value)} className="w-full rounded-xl border border-brand-primary/15 bg-white px-3 py-2 text-xs text-brand-fb outline-none focus:border-brand-primary" />
            </div>
          </div>

          <div>
            <p className="text-[10px] text-brand-fb/50 font-semibold mb-1.5">Trạng thái</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all" as const, label: "Tất cả" },
                { id: "selling" as const, label: "Đang bán" },
                { id: "low" as const, label: "Sắp hết" },
                { id: "out" as const, label: "Hết hàng" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setStockFilter(opt.id)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                    stockFilter === opt.id ? "bg-brand-primary text-white" : "bg-white border border-brand-primary/10 text-brand-fb/80 hover:bg-brand-primary/5"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
              <Fragment key={product.id}>
                <tr className="hover:bg-white transition-colors">
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
                  <td className="px-5 py-4 align-top relative">
                    <button
                      onClick={() => {
                        setOpenMenuId(null);
                        setOpenStatusId((prev) => (prev === product.id ? null : product.id));
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold cursor-pointer transition ${product.stock === 0 ? "bg-red-50 text-red-600 hover:bg-red-100" : product.stock <= 5 ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
                    >
                      {product.stock === 0 ? "Hết hàng" : product.stock <= 5 ? "Sắp hết" : "Đang bán"}
                    </button>

                    {openStatusId === product.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenStatusId(null)} />
                        <div className="absolute top-full mt-1.5 left-0 w-36 bg-white border border-brand-primary/10 rounded-xl shadow-lg overflow-hidden z-20">
                          {STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => handleSetStatus(product, opt.stock)}
                              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-[11px] text-left text-brand-fb hover:bg-brand-primary/5 transition"
                            >
                              {opt.label}
                              {((product.stock === 0 && opt.stock === 0) ||
                                (product.stock > 0 && product.stock <= 5 && opt.stock === 3) ||
                                (product.stock > 5 && opt.stock === 20)) && <Check size={13} className="text-brand-primary" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex gap-2 relative">
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/15 px-3 py-2 text-[11px] text-brand-fb font-semibold hover:bg-brand-primary/5 transition cursor-pointer"
                      >
                        <Edit3 size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="inline-flex items-center gap-2 rounded-full bg-white border border-red-100 px-3 py-2 text-[11px] text-red-600 font-semibold hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                      <button
                        onClick={() => handleSyncCategoryAndStock(product)}
                        title="Cập nhật danh mục & tồn kho hiện tại từ Kho hàng / Danh mục"
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold transition cursor-pointer ${
                          syncedId === product.id
                            ? "bg-green-50 border-green-100 text-green-700"
                            : "bg-white border-brand-primary/15 text-brand-fb hover:bg-brand-primary/5"
                        }`}
                      >
                        <RefreshCw size={14} /> {syncedId === product.id ? "Đã cập nhật" : "Cập nhật danh mục/kho"}
                      </button>
                      <button
                        onClick={() => {
                          setOpenStatusId(null);
                          setOpenMenuId((prev) => (prev === product.id ? null : product.id));
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-primary/15 px-3 py-2 text-[11px] text-brand-fb font-semibold hover:bg-brand-primary/5 transition cursor-pointer"
                      >
                        <MoreHorizontal size={14} /> Khác
                      </button>

                      {openMenuId === product.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div className="absolute top-full mt-1.5 right-0 w-52 bg-white border border-brand-primary/10 rounded-xl shadow-lg overflow-hidden z-20">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                navigate(`/products/${product.id}`);
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-left text-brand-fb hover:bg-brand-primary/5 transition"
                            >
                              <ExternalLink size={14} className="text-brand-primary" /> Xem trên cửa hàng
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(product)}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-left text-brand-fb hover:bg-brand-primary/5 transition border-t border-brand-primary/5"
                            >
                              <Copy size={14} className="text-brand-primary" /> Nhân bản sản phẩm
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>

                {editingId === product.id && (
                  <tr>
                    <td colSpan={6} className="px-5 py-5 bg-[#F9F4EC]">
                      <form onSubmit={handleSaveEdit} className="grid gap-4 md:grid-cols-4 items-end">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-brand-fb/60 mb-1.5">Tên sản phẩm</label>
                          <input
                            className="w-full rounded-xl border border-brand-primary/15 bg-white px-3.5 py-2.5 text-sm text-brand-fb outline-none focus:border-brand-primary"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-brand-fb/60 mb-1.5">Giá (VND)</label>
                          <input
                            type="number"
                            className="w-full rounded-xl border border-brand-primary/15 bg-white px-3.5 py-2.5 text-sm text-brand-fb outline-none focus:border-brand-primary"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                          />
                        </div>
                        <p className="text-[11px] text-brand-fb/50 md:col-span-1">
                          Danh mục &amp; tồn kho: dùng trang Danh mục / Kho hàng, hoặc nút "Cập nhật danh mục/kho" ở cột Thao tác.
                        </p>
                        <div className="md:col-span-4 flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-primary/15 px-4 py-2.5 text-xs font-semibold text-brand-fb hover:bg-brand-primary/5 transition cursor-pointer"
                          >
                            <X size={14} /> Hủy
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#9b4d3f] transition cursor-pointer"
                          >
                            <Check size={14} /> Lưu thay đổi
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
