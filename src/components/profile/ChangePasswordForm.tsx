import { useState, type FormEvent } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { auth, isFirebaseConfigured } from "../../lib/firebase";
import { logActivity } from "../../lib/activityService";
import { useApp } from "../../context/AppContext";

/**
 * Đổi mật khẩu qua Firebase Authentication (reauthenticateWithCredential +
 * updatePassword). Không lưu/log mật khẩu ở đâu — chỉ giữ trong state form,
 * gửi thẳng cho Firebase Auth SDK.
 */
export default function ChangePasswordForm() {
  const { currentUser } = useApp();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const firebaseUser = auth?.currentUser ?? null;
  const hasPasswordProvider = !!firebaseUser?.providerData?.some((p) => p.providerId === "password");

  if (!isFirebaseConfigured || !firebaseUser) {
    return (
      <div className="bg-white rounded-2xl border border-brand-primary/10 p-8 text-center space-y-3">
        <Lock size={32} className="text-brand-primary/40 mx-auto" />
        <h3 className="font-serif font-bold text-base text-brand-fb">Bảo mật &amp; đổi mật khẩu</h3>
        <p className="font-sans text-xs text-brand-fb/60 max-w-sm mx-auto">
          Tính năng đổi mật khẩu cần kết nối Firebase Authentication — hiện chưa khả dụng ở chế độ demo.
        </p>
      </div>
    );
  }

  if (!hasPasswordProvider) {
    return (
      <div className="bg-white rounded-2xl border border-brand-primary/10 p-8 text-center space-y-3">
        <Lock size={32} className="text-brand-primary/40 mx-auto" />
        <h3 className="font-serif font-bold text-base text-brand-fb">Bảo mật &amp; đổi mật khẩu</h3>
        <p className="font-sans text-xs text-brand-fb/60 max-w-sm mx-auto">
          Tài khoản của bạn đăng nhập bằng Google (hoặc mạng xã hội khác) và không có mật khẩu riêng trên hệ
          thống này. Vui lòng quản lý mật khẩu đăng nhập trực tiếp trong tài khoản Google của bạn.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ các trường.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("Mật khẩu mới phải khác mật khẩu hiện tại.");
      return;
    }
    if (!firebaseUser.email) {
      setError("Không tìm thấy email tài khoản để xác thực lại.");
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);

      if (currentUser) {
        void logActivity(currentUser.id, "password_changed", "Đổi mật khẩu thành công", "Mật khẩu tài khoản đã được cập nhật");
      }
    } catch (err) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Mật khẩu hiện tại không đúng. Vui lòng thử lại.");
      } else if (code === "auth/weak-password") {
        setError("Mật khẩu mới quá yếu. Vui lòng chọn mật khẩu mạnh hơn (tối thiểu 6 ký tự).");
      } else if (code === "auth/too-many-requests") {
        setError("Bạn thử sai quá nhiều lần. Vui lòng thử lại sau ít phút.");
      } else if (code === "auth/requires-recent-login") {
        setError("Phiên đăng nhập đã cũ. Vui lòng đăng xuất và đăng nhập lại rồi thử đổi mật khẩu.");
      } else {
        setError("Không thể đổi mật khẩu lúc này. Vui lòng thử lại sau.");
      }
      console.warn("[ChangePasswordForm] đổi mật khẩu thất bại:", code || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-primary/10 p-6 lg:p-8 space-y-4">
      <h3 className="font-serif font-bold text-base text-brand-fb border-b border-brand-primary/10 pb-3 flex items-center gap-1.5">
        <Lock size={16} className="text-brand-primary" />
        Đổi mật khẩu
      </h3>

      {error && (
        <div className="flex items-center gap-1.5 p-3 bg-red-50 text-red-600 rounded-lg text-xs font-sans">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-1.5 p-3 bg-green-50 text-green-700 rounded-lg text-xs font-sans">
          <CheckCircle2 size={13} className="shrink-0" />
          <span>Đổi mật khẩu thành công.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
        <div className="space-y-1">
          <label className="text-xs font-sans font-medium text-brand-fb/60">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full text-sm font-sans border border-brand-primary/15 bg-white rounded-xl px-3 py-2 text-brand-fb outline-none focus:border-brand-primary disabled:opacity-60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-sans font-medium text-brand-fb/60">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full text-sm font-sans border border-brand-primary/15 bg-white rounded-xl px-3 py-2 text-brand-fb outline-none focus:border-brand-primary disabled:opacity-60"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-sans font-medium text-brand-fb/60">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full text-sm font-sans border border-brand-primary/15 bg-white rounded-xl px-3 py-2 text-brand-fb outline-none focus:border-brand-primary disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-primary hover:bg-brand-primary-light text-white text-sm font-sans font-bold py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
}
