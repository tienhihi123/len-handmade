import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, LogIn, AlertTriangle, Eye, ShieldAlert, Settings, HelpCircle, X, CheckCircle, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "../components/Logo";
import { 
  isFirebaseConfigured, 
  auth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "../lib/firebase";
import { findExistingUser, setCurrentUser as persistCurrentUser } from "../utils/userStorage";
import { loginDemoUser, roleRedirects } from "../data/authAndTracking.mock";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, setCurrentUser, currentUser } = useApp();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showFirebaseDialog, setShowFirebaseDialog] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigHint, setShowConfigHint] = useState(false);
  const [configHintType, setConfigHintType] = useState<"email" | "google" | "facebook" | "apple">("email");
  const [showDomainHint, setShowDomainHint] = useState(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState("");

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMessage("Vui lòng nhập Email và mật khẩu.");
      setIsLoading(false);
      return;
    }

    if (isFirebaseConfigured && auth) {
      // Real Firebase operations
      try {
        if (isRegisterMode) {
          // Register Mode
          const userCredential = await createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
          if (userCredential.user) {
            setSuccessMessage("Đăng ký tài khoản thành công!");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        } else {
          // Sign In Mode
          const userCredential = await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
          if (userCredential.user) {
            const lowerEmail = emailInput.trim().toLowerCase();
            const redirectPath = roleRedirects[lowerEmail as keyof typeof roleRedirects] || "/";
            navigate(redirectPath);
          }
        }
      } catch (err: any) {
        console.error("Firebase auth error details:", err);
        const code = err.code || "";
        
        if (code === "auth/configuration-not-found") {
          setConfigHintType("email");
          setShowConfigHint(true);
          setErrorMessage(
            "Lỗi: Phương thức Email/Mật khẩu chưa được kích hoạt trong Firebase Console dự án của bạn (auth/configuration-not-found)."
          );
        } else if (code === "auth/user-not-found") {
          setErrorMessage("Tài khoản chưa tồn tại. Hãy chuyển sang tab 'ĐẶNG KÝ' bên dưới để tạo tài khoản mới.");
        } else if (code === "auth/wrong-password") {
          setErrorMessage("Mật khẩu không chính xác. Vui lòng kiểm tra lại.");
        } else if (code === "auth/email-already-in-use") {
          setErrorMessage("Email này đã được đăng ký. Vui lòng chuyển sang tab 'ĐĂNG NHẬP'.");
        } else if (code === "auth/weak-password") {
          setErrorMessage("Mật khẩu quá yếu. Vui lòng nhập tối thiểu 6 ký tự.");
        } else {
          setErrorMessage(`Lỗi xác thực Firebase: ${err.message || err}`);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback local simulation if Firebase is skipped/unconfigured
      try {
        if (isRegisterMode) {
          loginUser(emailInput, "email", `Khách Hàng Thủ Công (${emailInput})`);
          setSuccessMessage("Đăng ký giả lập thành công!");
          setTimeout(() => navigate("/"), 1200);
        } else {
          // Validate that the user exists locally before allowing login
          const trimmedEmail = emailInput.trim();
          const existing = findExistingUser(trimmedEmail, "email");
          if (existing) {
            loginUser(trimmedEmail, "email");
            navigate((existing.role as string) === "admin" ? "/admin/dashboard" : "/");
            return;
          }

          // Try demo credentials stored in the mock data file
          const demo = loginDemoUser(trimmedEmail, passwordInput);
          persistCurrentUser(demo.user as any);
          setCurrentUser(demo.user as any);
          navigate(demo.redirectPath || (demo.role === "admin" ? "/admin/dashboard" : "/"));
        }
      } catch (e: any) {
        if (e?.message === "NOT_FOUND") {
          setErrorMessage("Tài khoản không tồn tại. Vui lòng chuyển sang tab ĐĂNG KÝ để tạo tài khoản mới.");
        } else {
          setErrorMessage("Sai Email hoặc mật khẩu của cửa hàng.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    if (!isFirebaseConfigured || !auth) {
      setShowFirebaseDialog(true);
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);
    
    try {
      let authProvider;
      if (provider === "google") {
        authProvider = new GoogleAuthProvider();
      } else if (provider === "facebook") {
        authProvider = new FacebookAuthProvider();
        // Request public_profile and email scope from Facebook
        authProvider.addScope("public_profile");
        authProvider.addScope("email");
      } else {
        authProvider = new OAuthProvider("apple.com");
      }

      const result = await signInWithPopup(auth, authProvider);
      if (result.user) {
        const { uid, displayName, email, photoURL, providerId } = result.user;
        const currentProviderId = result.providerId || providerId || `${provider}.com`;
        
        console.log("Social Login Success User Info Details:", {
          uid,
          displayName,
          email,
          photoURL,
          providerId: currentProviderId,
        });

        const lowerEmail = email ? email.toLowerCase() : `${provider}_${uid}@tiemlennho.vn`;
        const mappedName = displayName || (provider === "facebook" ? "Nàng thơ Facebook" : "Thành viên Len");

        setSuccessMessage(`Đăng nhập thành công qua ${provider === "facebook" ? "Facebook" : provider.toUpperCase()}!`);
        setTimeout(() => {
          const redirectPath = roleRedirects[lowerEmail as keyof typeof roleRedirects] || "/";
          navigate(redirectPath);
        }, 1000);
      }
    } catch (err: any) {
      console.error("Social login auth error details:", err);
      const code = err.code || "";
      
      if (code === "auth/popup-closed-by-user") {
        setErrorMessage(
          "Cửa sổ đăng nhập (popup) đã bị đóng trước khi hoàn thành xác thực. Vui lòng bấm để đăng lại."
        );
      } else if (code === "auth/account-exists-with-different-credential") {
        setErrorMessage(
          "Tài khoản email này đã được sử dụng với một nhà cung cấp khác (ví dụ: Google hoặc Email). Vui lòng chọn đúng phương thức đăng nhập trước đó của bạn."
        );
      } else if (code === "auth/unauthorized-domain") {
        setShowDomainHint(true);
        setUnauthorizedDomain(window.location.hostname);
        setErrorMessage(
          "Lỗi: Tên miền hiện tại chưa được ủy quyền trong cài đặt Firebase Authentication (auth/unauthorized-domain)."
        );
      } else if (code === "auth/configuration-not-found") {
        setConfigHintType(provider);
        setShowConfigHint(true);
        setErrorMessage(
          `Lỗi: Nhà cung cấp đăng nhập ${provider === "facebook" ? "Facebook" : provider.toUpperCase()} chưa được bật trong Firebase Console (auth/configuration-not-found).`
        );
      } else if (err.message && err.message.includes("network-request-failed")) {
        setErrorMessage("Lỗi kết nối mạng: Không thể kết nối tới máy chủ Firebase. Vui lòng kiểm tra lại mạng.");
      } else {
        setErrorMessage(
          `Lỗi đăng nhập ${provider === "facebook" ? "Facebook" : provider.toUpperCase()}: ${err.message || err}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-[#FAF6F0] min-h-screen pt-32 pb-24 px-4 text-left flex items-center justify-center relative">
      {/* Decorative wool strands/background circles */}
      <div className="absolute top-20 left-[10%] w-[300px] h-[300px] bg-[#FBCFCF]/25 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-20 right-[10%] w-[350px] h-[350px] bg-[#CEAF75]/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white border border-brand-primary/10 rounded-2xl shadow-sm p-4 lg:p-5 space-y-6 z-10 relative"
      >
        <div className="text-center space-y-2">
          {/* Custom vector branding matching uploaded image */}
          <Logo size={110} animate={true} className="mx-auto" />
          <h1 className="font-serif font-extrabold text-2xl text-[#412C20] tracking-wide mt-2">
            {isRegisterMode ? "Tạo Tài Khoản Mới" : "Đăng Nhập Khách Hàng"}
          </h1>
          <p className="font-sans text-xs text-[#412C20]/60 max-w-xs mx-auto leading-relaxed">
            {isRegisterMode 
              ? "Tham gia cộng đồng len mộc mạc để lưu đơn hàng, nhận điểm thưởng tích xu dệt thơ lành tính."
              : "Đăng nhập để xem danh sách yêu thích, giỏ hàng dệt tay và quản lý đơn hàng của riêng bạn."}
          </p>
        </div>

        {/* Tab switcher design */}
        <div className="grid grid-cols-2 bg-brand-bg p-1 rounded-xl border border-brand-primary/10">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm uppercase tracking-wider font-bold transition-all ${
              !isRegisterMode 
                ? "bg-white text-[#412C20] shadow-sm" 
                : "text-[#412C20]/45 hover:text-[#412C20]/80"
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setErrorMessage("");
              setSuccessMessage("");
            }}
            className={`py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm uppercase tracking-wider font-bold transition-all ${
              isRegisterMode 
                ? "bg-white text-[#412C20] shadow-sm" 
                : "text-[#412C20]/45 hover:text-[#412C20]/80"
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Configuration instructions block if auth/configuration-not-found happens */}
        {showConfigHint && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-orange-50 border border-orange-200 rounded-2xl space-y-3 text-xs text-[#412C20]"
          >
            <div className="flex items-center gap-2 font-bold text-orange-700">
              <Settings size={16} />
              <span>HƯỚNG DẪN KÍCH HOẠT PHƯƠNG THỨC TRÊN FIREBASE</span>
            </div>
            <p className="text-[11px] text-[#412C20]/85 leading-relaxed">
              Firebase báo lỗi do phương thức <strong className="text-orange-950 font-bold uppercase">{configHintType === "email" ? "Email/Mật khẩu" : configHintType}</strong> chưa được kích hoạt trong Firebase Console dự án của bạn:
            </p>
            <ol className="list-decimal pl-4 text-[10.5px] space-y-1.5 text-orange-850 bg-white/60 p-2.5 rounded-xl border border-orange-100">
              <li>Mở trình duyệt truy cập <strong><a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline text-orange-750 font-bold hover:text-orange-900">Firebase Console ✦</a></strong></li>
              <li>Chọn dự án của bạn</li>
              <li>Ở cột bên trái, chọn <strong>Authentication</strong>, sau đó click tab <strong>Sign-in method</strong></li>
              <li>Nhấp <strong>Add new provider</strong> (hoặc Thêm nhà cung cấp mới)</li>
              <li>Chọn <strong>{configHintType === "email" ? "Email/Password" : configHintType === "google" ? "Google" : configHintType === "facebook" ? "Facebook" : "Apple"}</strong>:
                {configHintType === "facebook" && (
                  <span className="block mt-1 pl-2 text-[10px] text-neutral-600 border-l border-orange-300">
                    * Nhập <strong>App ID</strong> &amp; <strong>App Secret</strong> từ trang Meta for Developers. Sao chép địa chỉ <strong>OAuth Redirect URI</strong> hiển thị ở đó để dán vào cấu hình Facebook Login của bạn.
                  </span>
                )}
              </li>
              <li>Bật kích hoạt (<strong>Enable</strong>) rồi click <strong>Save / Lưu</strong>.</li>
            </ol>
            <p className="text-[10px] text-orange-750 italic">
              * Sau khi lưu thành công, hãy tải lại trang để bắt đầu đăng nhập!
            </p>
            <button
              onClick={() => {
                // Instantly let user login with a temporary beautiful bypass if they don't want to customize Firebase right now
                loginUser(emailInput || "tester@tiemlennho.vn", configHintType === "facebook" ? "facebook" : "email", configHintType === "facebook" ? "Tester Facebook" : "Tester Dùng Thử");
                navigate("/");
              }}
              className="w-full bg-white text-orange-800 hover:bg-orange-100/40 border border-orange-200 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors"
            >
              Dùng nhanh chế độ Simulator (Bỏ qua cấu hình Firebase)
            </button>
          </motion.div>
        )}

        {/* Domain Hint config */}
        {showDomainHint && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs text-[#412C20]"
          >
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <ShieldAlert size={16} />
              <span>ỦY QUYỀN TÊN MIỀN TRÊN FIREBASE</span>
            </div>
            <p className="text-[11px] text-[#412C20]/85 leading-relaxed">
              Tên miền hiện tại của bạn chưa được cấp phép truy cập xác thực Firebase Auth (lỗi <code className="bg-amber-100 px-1 font-mono rounded text-amber-900 text-[10px]">auth/unauthorized-domain</code>).
            </p>
            <div className="bg-white/80 p-2.5 rounded-xl border border-amber-100 text-[11px] space-y-1.5">
              <p className="text-[#412C20]/50 font-bold uppercase text-[9px] tracking-wider">Tên miền cần thêm:</p>
              <div className="flex items-center justify-between gap-2 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-100 font-mono text-[10.5px] select-all break-all text-neutral-800">
                <span>{unauthorizedDomain || "localhost"}</span>
              </div>
            </div>
            <ol className="list-decimal pl-4 text-[10.5px] space-y-1 text-amber-850 bg-white/60 p-2.5 rounded-xl border border-amber-100">
              <li>Mở <strong><a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline text-amber-700 font-bold hover:text-amber-900">Firebase Console ✦</a></strong></li>
              <li>Chọn <strong>Authentication</strong> &rarr; chọn tab <strong>Settings</strong> ở hàng bên cạnh</li>
              <li>Nhấp chọn mục <strong>Authorized domains</strong> (Miền được ủy quyền)</li>
              <li>Bấm nút <strong>Add domain</strong> (Thêm miền) rồi dán tên miền trên vào và lưu lại.</li>
            </ol>
            <p className="text-[10px] text-amber-700 italic">
              * Sau khi nhấn Thêm, hãy đợi 1 phút và tải lại trang này để đăng nhập hoàn thiện.
            </p>
            <button
              onClick={() => {
                // Instantly let user login with a temporary beautiful bypass if they don't want to customize Firebase right now
                loginUser(emailInput || "tester@tiemlennho.vn", "google", "Tester Dùng Thử (Local Google)");
                navigate("/");
              }}
              className="w-full bg-white text-amber-800 hover:bg-amber-100/40 border border-[#CEAF75]/40 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors"
            >
              Dùng nhanh chế độ Simulator (Bỏ qua cấu hình Firebase)
            </button>
          </motion.div>
        )}

        {/* Manual Credentials form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase tracking-wider">
              Email đăng nhập của bạn:
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="vd: nangtho@gmail.com..."
                className="w-full text-sm lg:text-base font-sans pl-10 pr-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fb/40" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs lg:text-sm font-sans font-medium text-brand-fb/60 uppercase tracking-wider">
              Mật khẩu mong muốn:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="******"
                className="w-full text-sm lg:text-base font-sans pl-10 pr-4 py-3 rounded-xl border border-brand-primary/20 bg-white text-brand-fb outline-none focus:ring-2 focus:ring-brand-primary/20 transition-colors"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fb/40" />
            </div>
          </div>

          {errorMessage && (
            <p className="text-[10.5px] text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-lg leading-relaxed flex items-center gap-1.5">
              <AlertTriangle size={12} className="shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}

          {successMessage && (
            <p className="text-[10.5px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle size={12} className="shrink-0" />
              <span>{successMessage}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm lg:text-base font-medium uppercase tracking-widest min-h-11 px-4 py-2.5 rounded-xl cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isRegisterMode ? <CheckCircle size={14} /> : <LogIn size={14} />
            )}
            {isRegisterMode ? "Đăng Ký Tài Khoản" : "Đăng Nhập Khách Hàng"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-3">
          <div className="h-[1px] bg-[#543D32]/10 flex-grow" />
          <span className="text-xs lg:text-sm font-medium text-brand-fb/40 uppercase tracking-wider whitespace-nowrap">
            Hoặc đăng nhập bằng
          </span>
          <div className="h-[1px] bg-[#543D32]/10 flex-grow" />
        </div>

        {/* Multi-provider login buttons */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin("google")}
            type="button"
            className="w-full bg-white hover:bg-brand-bg border border-brand-primary/20 text-brand-fb text-sm lg:text-base font-medium min-h-11 px-4 py-2.5 rounded-xl cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-5 lg:h-5">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-.1.8-1.5 1.74l3.15 2.45c1.84-1.7 2.92-4.2 2.92-6.02z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.1 7.95-2.95l-3.15-2.45c-.9.6-2 .95-3.3.95-3.13 0-5.78-2.1-6.73-5H3.14l-3.15 2.45C1.98 21.05 6.64 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.55A7.16 7.16 0 0112 7.5c1.78 0 3.1 1.05 4 1.45L19.18 5.7c-2-1.85-4.64-2.7-7.18-2.7C6.64 3 2 5.95 0 10l5.27 4.55z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.95 1.15 15.15 0 12 0 6.64 0 1.98 2.95 0 7.25l5.27 4.55c.95-2.9 3.6-5 6.73-5z"
              />
            </svg>
            Đăng nhập với Google
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleSocialLogin("facebook")}
            type="button"
            className="w-full bg-[#3B5998] hover:bg-[#344E86] text-white text-sm lg:text-base font-medium min-h-11 px-4 py-2.5 rounded-xl cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 lg:w-5 lg:h-5">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
            </svg>
            Đăng nhập với Facebook
          </button>

          {/* Apple */}
          <button
            onClick={() => handleSocialLogin("apple")}
            type="button"
            className="w-full bg-black hover:bg-neutral-900 text-white text-sm lg:text-base font-medium min-h-11 px-4 py-2.5 rounded-xl cursor-pointer transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 lg:w-5 lg:h-5">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.95.99-3.09-.96.04-2.13.64-2.82 1.45-.59.69-1.11 1.85-.97 2.97 1.08.08 2.14-.51 2.8-1.33z" />
            </svg>
            Đăng nhập với Apple
          </button>
        </div>

        {currentUser && (
          <div className="bg-[#FAF6F0] p-4.5 rounded-2xl border border-[#543D32]/10 text-center text-xs">
            Đang đăng nhập dưới tên: <strong className="text-[#CEAF75]">{currentUser.name}</strong>
          </div>
        )}
      </motion.div>

      {/* Firebase setup information modal dialog */}
      <AnimatePresence>
        {showFirebaseDialog && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-[32px] border border-[#543D32]/15 shadow-2xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden"
            >
              {/* Top orange highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#CEAF75]" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-[#CEAF75]/10 rounded-full text-[#CEAF75]">
                    <ShieldAlert size={22} />
                  </span>
                  <div>
                    <h3 className="font-serif font-black text-lg text-[#412C20]">
                      Yêu Cầu Cấu Hình Firebase
                    </h3>
                    <p className="text-[10px] font-sans text-[#412C20]/45 tracking-widest uppercase">
                      Social Login Integration Guidance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFirebaseDialog(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 font-sans text-xs text-[#412C20]/80">
                <p className="leading-relaxed text-neutral-600">
                  Đăng nhập thật qua <strong className="text-[#412C20]">Google / Facebook / Apple</strong> yêu cầu liên kết với ứng dụng Firebase của bạn để giữ an toàn tuyệt đối cho người dùng.
                </p>

                <div className="bg-[#FAF6F0] rounded-2xl border border-[#543D32]/10 p-4.5 space-y-3">
                  <h4 className="font-semibold text-[#412C20] flex items-center gap-1.5">
                    <Settings size={14} className="text-[#CEAF75]" />
                    CẤU HÌNH BIẾN MÔI TRƯỜNG:
                  </h4>
                  <p className="text-[11px] leading-relaxed text-neutral-500">
                    Vui lòng mở mục <strong>Settings Panel</strong> ở cột bên của giao diện <strong>AI Studio</strong>, chọn mục <strong>Secrets</strong> và thêm đầy đủ các biến môi trường Client-side sau:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10.5px] bg-white border border-[#543D32]/5 p-3 rounded-xl text-[#CEAF75] font-bold">
                    <li>✦ VITE_FIREBASE_API_KEY</li>
                    <li>✦ VITE_FIREBASE_AUTH_DOMAIN</li>
                    <li>✦ VITE_FIREBASE_PROJECT_ID</li>
                    <li>✦ VITE_FIREBASE_STORAGE_BUCKET</li>
                    <li>✦ VITE_FIREBASE_MESSAGING_S_ID</li>
                    <li>✦ VITE_FIREBASE_APP_ID</li>
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-semibold text-[#412C20] flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-[#CEAF75]" />
                    HƯỚNG DẪN KIỂM THỬ ĐĂNG NHẬP:
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1.5 text-neutral-500 leading-relaxed text-[11px]">
                    <li>Khi đã điền các biến môi trường ở trên, hãy khởi động lại hoặc ứng dụng sẽ tự động tải cấu hình Firebase thực.</li>
                    <li>Đảm bảo bạn đã bật các hình thức đăng nhập này trong <strong>Firebase Console &rarr; Authentication &rarr; Sign-in method</strong>.</li>
                    <li>Ấn các nút để mở popup đăng nhập thật của trình duyệt. Sau khi đăng nhập thành công, hệ thống tự động lưu giỏ hàng/yêu thích/đơn hàng cô lập dưới UID thật đó của bạn!</li>
                  </ol>
                </div>
              </div>

              <div className="pt-4 border-t border-[#543D32]/10 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    // Fallback login directly to test isolated customer data in localhost session
                    setShowFirebaseDialog(false);
                    loginUser("google_tester@tiemlennho.vn", "google", "Kiểm thử Google Local");
                    navigate("/");
                  }}
                  className="w-full sm:w-auto bg-[#FAF6F0] hover:bg-[#CEAF75]/10 border border-[#543D32]/15 text-[#412C20] text-xs font-semibold py-3 px-5 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  Bỏ qua &amp; Đăng nhập mô phỏng Google
                </button>
                <button
                  type="button"
                  onClick={() => setShowFirebaseDialog(false)}
                  className="w-full sm:w-auto flex-1 bg-[#CEAF75] hover:bg-[#Bfa066] text-white text-xs font-semibold py-3 px-5 rounded-2xl cursor-pointer transition-all flex items-center justify-center"
                >
                  Tôi đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

