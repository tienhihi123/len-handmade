import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Star, ShoppingBag, Eye, Trash2, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { wishlist, setWishlist, productsList, trackView, viewStats } = useApp();

  // Find all actual favorited products with optional colors
  const favoriteItems = wishlist.map((item) => {
    const [id, color] = item.split("::");
    const product = productsList.find((p) => p.id === id);
    if (!product) return null;
    return {
      product,
      wishlistItemId: item, // e.g. "prod_7::Xanh Dương Bình Yên" or "prod_7"
      selectedColor: color || "",
    };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  const handleRemoveFavorite = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setWishlist((prev) => prev.filter((p) => p !== itemId));
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10 pb-6 border-b border-[#543D32]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#CEAF75] block mb-2">
              ✦ Trái tim khâu dệt ✦
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#412C20]">
              Sản Phẩm Yêu Thích Của Bạn
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#412C20]/60 mt-1">
              Nơi lưu giữ những tuyệt tác len dệt nơ, gấu bông mộc mạc làm tim bạn say đắm.
            </p>
          </div>
          <span className="text-xs font-mono bg-white border border-[#543D32]/10 px-4 py-2 rounded-2xl text-[#412C20] font-bold">
            YÊU THÍCH ({favoriteItems.length})
          </span>
        </div>

        {/* Empty State Banner */}
        {favoriteItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center bg-white rounded-[32px] border border-[#543D32]/10 shadow-sm p-8 max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 bg-[#FBCFCF]/40 text-[#E58888] rounded-full flex items-center justify-center text-3xl mx-auto animate-pulse">
              ❤️
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-black text-xl text-[#412C20]">
                Tủ hàng trái tim đang trống
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#412C20]/55 max-w-xs mx-auto leading-relaxed">
                Bạn chưa yêu thích sản phẩm nào. Đừng bỏ lỡ các báu vật len dệt tay giới hạn tuần này nhé!
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#CEAF75] hover:bg-[#Bfa066] text-white text-xs font-bold uppercase tracking-widest pl-6 pr-5 py-3.5 rounded-full shadow hover:shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 mx-auto active:scale-95"
            >
              Khám phá sản phẩm
              <ArrowRight size={13} />
            </button>
          </motion.div>
        ) : (
          /* curating grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {favoriteItems.map((item) => {
                const { product, wishlistItemId, selectedColor } = item;
                const viewsStat = viewStats?.find((s) => s.productId === product.id);
                // Generate stable seed views for non-tracked products to prevent random UI shifts on hover
                const stableBaseViews = product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50 + 12;
                const totalViews = viewsStat ? viewsStat.totalViews : stableBaseViews;

                const matchedColorObj = product.colors?.find(c => c.name === selectedColor);
                const resolvedWishlistImage = matchedColorObj?.image || product.image;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={wishlistItemId}
                    whileHover={{ y: -6 }}
                    onClick={() => {
                      navigate(`/products/${product.id}`, { state: { selectedColor } });
                    }}
                    className="bg-white rounded-3xl border border-[#543D32]/8 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group h-full"
                  >
                    {/* Image space */}
                    <div className="relative aspect-square overflow-hidden bg-[#FAF6F0]">
                      <img
                        src={resolvedWishlistImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Removing top action button */}
                      <button
                        onClick={(e) => handleRemoveFavorite(wishlistItemId, e)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-all cursor-pointer z-10"
                        title="Xóa ra khỏi danh sách yêu thích"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="absolute bottom-3 left-3 bg-[#412C20]/80 backdrop-blur-sm text-white text-[9px] px-2.5 py-1 rounded-md font-sans select-none">
                        {product.material}
                      </div>
                    </div>

                    {/* Meta info details */}
                    <div className="p-5 flex flex-col justify-between flex-grow text-left">
                      <div className="space-y-1.5 flex-grow">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="text-[10px] bg-[#CEAF75]/10 text-[#CEAF75] px-2.5 py-0.5 rounded-full font-sans font-semibold select-none">
                            {product.category}
                          </span>
                          <div className="flex items-center text-yellow-500 gap-0.5">
                            <Star size={10} className="fill-current" />
                            <span className="text-[10px] font-mono leading-none text-[#412C20] font-bold">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-serif font-bold text-sm text-[#412C20] group-hover:text-[#CEAF75] transition-colors leading-snug line-clamp-1 mt-1">
                          {product.name} {selectedColor && <span className="text-[#CEAF75] text-xs font-sans">({selectedColor})</span>}
                        </h3>
                        <p className="font-sans text-xs text-[#412C20]/60 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* prices and interactions actions count */}
                      <div className="mt-4 pt-3.5 border-t border-[#543D32]/5 flex items-center justify-between">
                        <div>
                          {product.oldPrice && (
                            <span className="text-[10px] text-[#412C20]/30 line-through mr-1.5">
                              {product.oldPrice.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                          <span className="text-xs font-mono font-black text-[#CEAF75]">
                            {product.priceLabel || `${product.price.toLocaleString("vi-VN")}đ`}
                          </span>
                        </div>
                        <div className="font-mono text-[9px] text-[#412C20]/40 flex items-center gap-1">
                          <Eye size={10} />
                          <span>{totalViews} lượt xem</span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
