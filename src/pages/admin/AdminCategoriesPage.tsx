import { useMemo, useState, FormEvent } from "react";
import { Layers, Pencil, Trash2, Plus, Check, X, ArrowRightLeft } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { upsertCategoryToFirestore, deleteCategoryFromFirestore } from "../../lib/firestoreCategories";
import { updateProductFieldsInFirestore } from "../../lib/firestoreProducts";

const UNCATEGORIZED = "Chưa phân loại";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const { categoriesList, setCategoriesList, productsList, setProductsList } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [pendingMoves, setPendingMoves] = useState<Record<string, string>>({});

  const productCountByCategory = useMemo(() => {
    const map = new Map<string, number>();
    productsList.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
    return map;
  }, [productsList]);

  const maxCount = Math.max(...Array.from(productCountByCategory.values()) as number[], 1);

  const handleStartRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveRename = (e: FormEvent, id: string, oldName: string) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;
    const existing = categoriesList.find((c) => c.id === id);
    const updated = existing ? { ...existing, name: trimmed, slug: slugify(trimmed) } : null;
    setCategoriesList((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed, slug: slugify(trimmed) } : c)));
    if (updated) upsertCategoryToFirestore(updated);
    if (trimmed !== oldName) {
      setProductsList((prev) => prev.map((p) => (p.category === oldName ? { ...p, category: trimmed } : p)));
      productsList
        .filter((p) => p.category === oldName)
        .forEach((p) => updateProductFieldsInFirestore(p.id, { category: trimmed }));
    }
    setEditingId(null);
  };

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newCategory = {
      id: `cat_${Date.now()}`,
      name: newName.trim(),
      slug: slugify(newName),
      description: newDescription.trim() || "Danh mục mới tạo từ trang quản trị.",
      image: ""
    };
    setCategoriesList((prev) => [...prev, newCategory]);
    upsertCategoryToFirestore(newCategory);
    setNewName("");
    setNewDescription("");
    setShowAddForm(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const count = productCountByCategory.get(name) || 0;
    const confirmMsg =
      count > 0
        ? `Xóa danh mục "${name}"? ${count} sản phẩm trong danh mục này sẽ được chuyển sang "${UNCATEGORIZED}".`
        : `Xóa danh mục "${name}"?`;
    if (!window.confirm(confirmMsg)) return;
    if (count > 0) {
      setProductsList((prev) => prev.map((p) => (p.category === name ? { ...p, category: UNCATEGORIZED } : p)));
      productsList
        .filter((p) => p.category === name)
        .forEach((p) => updateProductFieldsInFirestore(p.id, { category: UNCATEGORIZED }));
    }
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
    deleteCategoryFromFirestore(id);
  };

  const handleMoveProduct = (productId: string, newCategory: string) => {
    setProductsList((prev) => prev.map((p) => (p.id === productId ? { ...p, category: newCategory } : p)));
    updateProductFieldsInFirestore(productId, { category: newCategory });
    setPendingMoves((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#CEAF75]/12 flex items-center justify-center shrink-0">
            <Layers size={18} className="text-[#CEAF75]" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#CEAF75] font-semibold">Sản phẩm</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#412C20] leading-tight">Danh mục ({categoriesList.length})</h1>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-[#CEAF75] text-white px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] cursor-pointer hover:bg-[#bfa066] transition"
        >
          <Plus size={14} /> Thêm danh mục
        </button>
      </div>
      <p className="text-xs text-[#75645A] -mt-2">Chỉnh sửa tên, thêm/xóa danh mục và chuyển sản phẩm sang danh mục khác ngay tại đây.</p>

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="bg-white p-5 rounded-2xl border border-[#E8DDD1] grid gap-3 sm:grid-cols-2">
          <input
            required
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên danh mục mới"
            className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none focus:border-[#CEAF75]"
          />
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Mô tả ngắn"
            className="rounded-xl border border-[#E8DDD1] px-3.5 py-2.5 text-sm outline-none focus:border-[#CEAF75]"
          />
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="rounded-xl border border-[#E8DDD1] bg-white px-4 py-2.5 text-xs font-bold text-[#412C20] cursor-pointer">Hủy</button>
            <button type="submit" className="rounded-xl bg-[#412C20] text-white text-xs font-bold px-5 py-2.5 cursor-pointer">Lưu danh mục</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-[#E8DDD1] divide-y divide-[#E8DDD1] overflow-hidden">
        {categoriesList.map((cat) => {
          const count = productCountByCategory.get(cat.name) || 0;
          const fillPct = Math.round((count / maxCount) * 100);
          const isEditing = editingId === cat.id;
          return (
            <div key={cat.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAF6F0] transition-colors">
              <div className="w-10 h-10 rounded-2xl bg-[#CEAF75]/12 flex items-center justify-center shrink-0">
                <Layers size={16} className="text-[#CEAF75]" />
              </div>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <form onSubmit={(e) => handleSaveRename(e, cat.id, cat.name)} className="flex items-center gap-1.5 max-w-sm">
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-[#CEAF75]/40 px-2.5 py-1.5 text-sm font-serif font-bold text-[#412C20] outline-none focus:border-[#CEAF75]"
                    />
                    <button type="submit" className="shrink-0 p-1.5 rounded-full bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer"><Check size={14} /></button>
                    <button type="button" onClick={() => setEditingId(null)} className="shrink-0 p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"><X size={14} /></button>
                  </form>
                ) : (
                  <h3 className="font-serif text-base font-black text-[#412C20] leading-tight truncate">{cat.name}</h3>
                )}
                <p className="text-[11px] text-[#75645A] truncate mt-0.5">{cat.description}</p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-1 w-32 shrink-0">
                <span className="text-[10px] font-bold text-[#412C20]">{count} sản phẩm</span>
                <div className="h-1.5 w-full rounded-full bg-[#FAF6F0] overflow-hidden">
                  <div className="h-full rounded-full bg-[#CEAF75] transition-all duration-500" style={{ width: `${fillPct}%` }} />
                </div>
              </div>

              {!isEditing && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleStartRename(cat.id, cat.name)}
                    title="Sửa tên"
                    className="p-2 rounded-full border border-[#E8DDD1] bg-white text-[#412C20] hover:bg-[#FAF6F0] transition cursor-pointer"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    title="Xóa danh mục"
                    className="p-2 rounded-full border border-red-100 bg-white text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-[#E8DDD1] p-5 space-y-4">
        <div className="flex items-center gap-2 text-[#CEAF75] font-bold text-xs uppercase tracking-[0.24em]">
          <ArrowRightLeft size={16} /> Chuyển sản phẩm sang danh mục khác
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.24em] text-[#75645A]">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục hiện tại</th>
                <th className="px-4 py-3">Chuyển sang</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DDD1]">
              {productsList.map((p) => {
                const pending = pendingMoves[p.id];
                const hasPendingChange = pending !== undefined && pending !== p.category;
                return (
                  <tr key={p.id} className="hover:bg-[#FAF6F0] transition-colors">
                    <td className="px-4 py-3 text-[#412C20] font-semibold max-w-[260px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-[#75645A]">{p.category}</td>
                    <td className="px-4 py-3">
                      <select
                        value={pending ?? p.category}
                        onChange={(e) => setPendingMoves((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        className="rounded-xl border border-[#E8DDD1] px-3 py-2 text-xs text-[#412C20] outline-none focus:border-[#CEAF75] cursor-pointer"
                      >
                        {categoriesList.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                        {!categoriesList.some((c) => c.name === UNCATEGORIZED) && p.category === UNCATEGORIZED && (
                          <option value={UNCATEGORIZED}>{UNCATEGORIZED}</option>
                        )}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        disabled={!hasPendingChange}
                        onClick={() => handleMoveProduct(p.id, pending!)}
                        className="rounded-xl bg-[#412C20] text-white text-xs font-bold px-4 py-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        Xác nhận đổi
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
