import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAdminAuth } from "../../context/AdminAuthContext";

/**
 * Top-level gate for the whole /admin/* subtree.
 * Blocks anyone who isn't a logged-in, active staff member before any
 * admin data or child route even mounts.
 */
export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();
  const { staff, isActiveStaff, isLoading } = useAdminAuth();

  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Loading state: đang kiểm tra quyền từ Firestore
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="text-center space-y-4">
          <div className="inline-block w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-cocoa text-sm font-sans">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <Navigate
        to="/admin/unauthorized"
        replace
        state={{ reason: "Tài khoản này không có quyền truy cập Control Panel." }}
      />
    );
  }

  if (staff.status === "suspended") {
    return (
      <Navigate
        to="/admin/unauthorized"
        replace
        state={{ reason: "Tài khoản nhân viên của bạn đang bị tạm khóa. Vui lòng liên hệ Quản trị viên." }}
      />
    );
  }

  if (staff.status === "disabled" || staff.status === "invited") {
    return (
      <Navigate
        to="/admin/unauthorized"
        replace
        state={{
          reason:
            staff.status === "disabled"
              ? "Tài khoản nhân viên này đã bị vô hiệu hóa."
              : "Tài khoản nhân viên chưa được kích hoạt. Vui lòng hoàn tất lời mời trước."
        }}
      />
    );
  }

  if (!isActiveStaff) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
