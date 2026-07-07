import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { previewMigration, executeMigration, isMigrationCompleted, resetMigrationStatus, MigrationPreview, MigrationResult } from "../../lib/migrationService";
import {
  migrationCategories,
  migrationProducts,
  migrationVariants,
  migrationValidation,
  migrationSourceCounts
} from "../../lib/migrationSource";
import { Database, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminMigrationPage() {
  const { staff } = useAdminAuth();
  const [preview, setPreview] = useState<MigrationPreview | null>(null);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCompleted = isMigrationCompleted();
  const isSuperAdmin = staff?.roleId === "admin";
  const canRunMigration = migrationValidation.valid;

  const handlePreview = async () => {
    if (!canRunMigration) return;
    setLoading(true);
    setError(null);
    try {
      const previewData = await previewMigration(migrationCategories, migrationProducts, migrationVariants);
      setPreview(previewData);
    } catch (err: any) {
      setError(err.message || "Failed to preview migration");
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!preview) return;
    if (!confirm("Xác nhận nhập dữ liệu vào Firestore? Thao tác này không thể hoàn tác.")) return;

    setLoading(true);
    setError(null);
    try {
      const migrationResult = await executeMigration(preview);
      setResult(migrationResult);
      setPreview(null);
    } catch (err: any) {
      setError(err.message || "Migration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset trạng thái migration? Chỉ dùng cho testing.")) return;
    resetMigrationStatus();
    setPreview(null);
    setResult(null);
    setError(null);
    window.location.reload();
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-red-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-red-700">Chỉ Super Admin mới có thể chạy migration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Database className="w-8 h-8 text-gold" />
          <div>
            <h1 className="text-2xl font-serif text-cocoa">Migration Tool</h1>
            <p className="text-sm text-body-text">Nhập dữ liệu từ localStorage vào Firestore</p>
          </div>
        </div>

        {/* Source Counts */}
        <div className="bg-white rounded-xl border border-divider-beige p-6">
          <h3 className="font-semibold text-cocoa mb-2">Nguồn dữ liệu (static)</h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-body-text">
            <p>Source categories: <span className="font-semibold text-cocoa">{migrationSourceCounts.categories}</span></p>
            <p>Source products: <span className="font-semibold text-cocoa">{migrationSourceCounts.products}</span></p>
            <p>Source variants: <span className="font-semibold text-cocoa">{migrationSourceCounts.variants}</span></p>
          </div>
        </div>

        {/* Validation Errors */}
        {!migrationValidation.valid && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">Dữ liệu nguồn không hợp lệ</h3>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  {migrationValidation.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
                <p className="text-sm text-red-700 mt-2">Preview và Execute bị vô hiệu hóa cho đến khi các lỗi trên được khắc phục.</p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {migrationValidation.warnings.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-2">Cảnh báo dữ liệu</h3>
            <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
              {migrationValidation.warnings.map((warn, idx) => (
                <li key={idx}>{warn}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Migration Status */}
        {isCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 mb-1">Migration đã hoàn tất</h3>
                <p className="text-sm text-green-700">Dữ liệu đã được nhập vào Firestore. Hệ thống hiện đang dùng Firestore làm nguồn dữ liệu chính.</p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-green-700 hover:text-green-900 underline"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Lỗi</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Button */}
        {!preview && !result && (
          <div className="bg-white rounded-xl border border-divider-beige p-6">
            <h2 className="text-lg font-serif text-cocoa mb-4">Bước 1: Preview dữ liệu</h2>
            <p className="text-sm text-body-text mb-6">
              Kiểm tra dữ liệu localStorage và Firestore để xem có bản ghi nào trùng không.
            </p>
            <button
              onClick={handlePreview}
              disabled={loading || !canRunMigration}
              className="px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang quét...
                </>
              ) : (
                "Preview Migration"
              )}
            </button>
          </div>
        )}

        {/* Preview Results */}
        {preview && (
          <div className="bg-white rounded-xl border border-divider-beige p-6 space-y-6">
            <h2 className="text-lg font-serif text-cocoa">Preview Migration</h2>

            <div className="grid grid-cols-3 gap-4">
              {/* Categories */}
              <div className="border border-divider-beige rounded-lg p-4">
                <h3 className="font-semibold text-cocoa mb-2">Categories</h3>
                <div className="text-sm text-body-text space-y-1">
                  <p>Tổng: {preview.categories.total}</p>
                  <p className="text-green-600">Mới: {preview.categories.new}</p>
                  <p className="text-orange-600">Đã có: {preview.categories.existing}</p>
                </div>
              </div>

              {/* Products */}
              <div className="border border-divider-beige rounded-lg p-4">
                <h3 className="font-semibold text-cocoa mb-2">Products</h3>
                <div className="text-sm text-body-text space-y-1">
                  <p>Tổng: {preview.products.total}</p>
                  <p className="text-green-600">Mới: {preview.products.new}</p>
                  <p className="text-orange-600">Đã có: {preview.products.existing}</p>
                </div>
              </div>

              {/* Variants */}
              <div className="border border-divider-beige rounded-lg p-4">
                <h3 className="font-semibold text-cocoa mb-2">Variants</h3>
                <div className="text-sm text-body-text space-y-1">
                  <p>Tổng: {preview.variants.total}</p>
                  <p className="text-green-600">Mới: {preview.variants.new}</p>
                  <p className="text-orange-600">Đã có: {preview.variants.existing}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleExecute}
                disabled={
                  loading ||
                  !canRunMigration ||
                  !preview ||
                  (preview.categories.new === 0 && preview.products.new === 0 && preview.variants.new === 0)
                }
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang ghi...
                  </>
                ) : (
                  "Xác nhận nhập dữ liệu"
                )}
              </button>
              <button
                onClick={() => setPreview(null)}
                disabled={loading}
                className="px-6 py-3 border border-divider-beige text-cocoa rounded-lg hover:bg-ivory"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Migration Result */}
        {result && (
          <div className={`rounded-xl border p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.success ? 'Migration thành công!' : 'Migration thất bại'}
                </h3>
                {result.success && (
                  <div className="text-sm text-green-700 space-y-1">
                    <p>✓ {result.categoriesCreated} categories đã tạo</p>
                    <p>✓ {result.productsCreated} products đã tạo</p>
                    <p>✓ {result.variantsCreated} variants đã tạo</p>
                  </div>
                )}
                {result.errors.length > 0 && (
                  <div className="text-sm text-red-700 mt-2">
                    <p className="font-semibold">Lỗi:</p>
                    <ul className="list-disc list-inside">
                      {result.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {result.success && (
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Reload trang
              </button>
            )}
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Lưu ý</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Migration chỉ tạo bản ghi mới, không ghi đè bản ghi đã có</li>
            <li>ID, slug, SKU được giữ nguyên từ localStorage</li>
            <li>LocalStorage không bị xóa sau migration</li>
            <li>Migration chỉ chạy được 1 lần (có thể reset bằng nút Reset)</li>
            <li>Batch write tối đa 500 records/lần</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
