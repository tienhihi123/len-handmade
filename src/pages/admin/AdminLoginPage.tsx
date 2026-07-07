import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldCheck, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { isFirebaseConfigured, auth, signInWithEmailAndPassword, signOut } from "../../lib/firebase";
import { setCurrentUser as persistCurrentUser } from "../../utils/userStorage";
import { loginDemoUser } from "../../data/authAndTracking.mock";
import { findStaffByEmail, touchStaffLastLogin } from "../../data/staff.mock";
import { STAFF_ROLE_DASHBOARD_PATH, STAFF_ROLE_LABELS } from "../../lib/permissions";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /** Applies the staff authorization rules once we know the authenticated email. */
  const authorizeStaffOrReject = (authedEmail: string, demoUserPayload: any): boolean => {
    const staff = findStaffByEmail(authedEmail);

    if (!staff) {
      setError("Tài khoản này không có quyền truy cập Control Panel.");
      return false;
    }
    if (staff.status === "suspended") {
      setError("Tài khoản nhân viên đang bị tạm khóa. Vui lòng liên hệ Quản trị viên.");
      return false;
    }
    if (staff.status === "disabled") {
      setError("Tài khoản nhân viên đã bị vô hiệu hóa.");
      return false;
    }
    if (staff.status === "invited") {
      setError("Tài khoản nhân viên chưa được kích hoạt.");
      return false;
    }
    if (staff.status !== "active") {
      setError("Tài khoản nhân viên không ở trạng thái hợp lệ để đăng nhập.");
      return false;
    }

    // Persist the session (role display driven entirely by the staff doc, never by email).
    persistCurrentUser(demoUserPayload);
    setCurrentUser(demoUserPayload);
    touchStaffLastLogin(staff.uid);
    navigate(STAFF_ROLE_DASHBOARD_PATH[staff.roleId]);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        const authedEmail = result.user.email || email.trim();
        const staff = findStaffByEmail(authedEmail);
        if (!staff) {
          await signOut(auth);
          setError("Tài khoản này không có quyền truy cập Control Panel.");
          setIsLoading(false);
          return;
        }
        const demoPayload = {
          id: result.user.uid,
          name: staff.displayName,
          email: authedEmail,
          role: staff.roleId === "admin" ? "admin" : "store_owner",
          status: "active" as const,
          avatar: staff.avatar,
          createdAt: staff.createdAt,
          lastLoginAt: new Date().toISOString(),
          totalLoginCount: 1
        };
        const ok = authorizeStaffOrReject(authedEmail, demoPayload);
        if (!ok) await signOut(auth);
      } else {
        // No live Firebase project configured — fall back to the demo credential
        // check for authentication only. Authorization still comes solely from
        // the staff directory below, never from this password check's role field.
        const demo = loginDemoUser(email.trim(), password);
        authorizeStaffOrReject(email.trim(), demo.user);
      }
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/wrong-password" || code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setError("Email hoặc mật khẩu không chính xác.");
      } else if (err?.message === "NOT_FOUND" || err?.message?.includes("không tìm thấy")) {
        setError("Không tìm thấy tài khoản.");
      } else {
        setError(err?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2B221B] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#FBF6F0] rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#CEAF75]/15 flex items-center justify-center">
            <ShieldCheck className="text-[#CEAF75]" size={26} />
          </div>
          <h1 className="font-serif text-2xl font-black text-[#412C20]">Tiệm Len Nhỏ Control Panel</h1>
          <p className="text-xs text-[#75645A]">Dành riêng cho Admin và nhân viên nội bộ.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-[#BA1A1A] text-xs font-semibold rounded-2xl px-4 py-3">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#75645A] font-bold mb-1.5">Email nhân viên</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75645A]/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@tiemlennho.vn"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8DDD1] bg-white text-sm text-[#412C20] outline-none focus:border-[#CEAF75]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-[#75645A] font-bold mb-1.5">Mật khẩu</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#75645A]/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E8DDD1] bg-white text-sm text-[#412C20] outline-none focus:border-[#CEAF75]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#CEAF75] text-white text-xs font-bold uppercase tracking-[0.18em] py-3.5 hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Đang xác thực..." : "Đăng nhập Control Panel"}
          </button>
        </form>

        <p className="text-center text-[11px] text-[#75645A]/70">
          Không phải nhân viên?{" "}
          <a href="/login" className="text-[#CEAF75] font-semibold hover:underline">
            Đăng nhập tài khoản khách hàng
          </a>
        </p>

        <details className="text-[10px] text-[#75645A]/60 bg-white/60 rounded-xl px-3.5 py-2.5">
          <summary className="cursor-pointer font-semibold">Tài khoản demo (môi trường dev)</summary>
          <p className="mt-1.5 leading-relaxed">
            admin@lenhandmade.vn / 123456 → {STAFF_ROLE_LABELS.admin}
          </p>
        </details>
      </div>
    </div>
  );
}
