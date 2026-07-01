export default function AdminSettingsPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-semibold">Cài đặt hệ thống</span>
        <h1 className="font-serif text-3xl font-black text-brand-fb">Cấu hình & thiết lập Tiệm Len Nhỏ</h1>
        <p className="text-sm text-brand-fb/70 max-w-2xl">Khu vực cài đặt hệ thống dành cho tùy chỉnh thương hiệu, thanh toán và bảo mật.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <h2 className="font-semibold text-brand-fb">Thông tin thương hiệu</h2>
          <p className="mt-3 text-sm text-brand-fb/70">Tên cửa hàng, logo, màu chủ đạo và mô tả thương hiệu đang được sử dụng.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <h2 className="font-semibold text-brand-fb">Cài đặt thanh toán</h2>
          <p className="mt-3 text-sm text-brand-fb/70">Cổng thanh toán, phí vận chuyển và lịch trình hoàn tiền có thể được cấu hình ở đây.</p>
        </div>
        <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
          <h2 className="font-semibold text-brand-fb">Bảo mật & quyền truy cập</h2>
          <p className="mt-3 text-sm text-brand-fb/70">Quyền admin, phân quyền nhân sự và báo cáo hoạt động sẽ được thiết lập ở trang sau.</p>
        </div>
      </div>

      <div className="bg-brand-card rounded-3xl border border-brand-primary/10 p-6 shadow-sm">
        <div className="rounded-3xl bg-white p-6 border border-brand-primary/10 shadow-sm">
          <h2 className="font-serif text-xl font-black text-brand-fb">Trang cài đặt đang phát triển</h2>
          <p className="mt-3 text-sm text-brand-fb/70">Đây là khu vực placeholder cho các thiết lập chi tiết như cấu hình CMS, tích hợp thanh toán, SEO và chính sách.</p>
        </div>
      </div>
    </div>
  );
}
