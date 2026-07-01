import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Gift, CheckCircle2, Copy, LogOut, ShieldAlert, Award, Calendar, CreditCard, Clock, Hourglass, Phone, MapPin, AlertCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AccountPage() {
  const navigate = useNavigate();
  const { currentUser, logoutUser, coinsWallet, setCoinsWallet, addActivity } = useApp();

  const [checkInDone, setCheckInDone] = useState(() => localStorage.getItem("mission_checkin_done") === "true");
  const [profileDone, setProfileDone] = useState(() => localStorage.getItem("mission_profile_done") === "true");
  const [blogReadDone, setBlogReadDone] = useState(() => localStorage.getItem("mission_blogread_done") === "true");
  const [isBlogCompleted, setIsBlogCompleted] = useState(() => localStorage.getItem("len_blog_read_achievement") === "true");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Profile Form States
  const [isExpandingProfile, setIsExpandingProfile] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [profileFormError, setProfileFormError] = useState("");

  // Sync state on load
  useEffect(() => {
    const hasRead = localStorage.getItem("len_blog_read_achievement") === "true";
    setIsBlogCompleted(hasRead);
  }, []);

  // If visitor is anon, redirect to login page sheets
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaimCoins = (mission: "checkin" | "profile" | "blogRead") => {
    if (mission === "checkin") {
      localStorage.setItem("mission_checkin_done", "true");
      setCheckInDone(true);
      setCoinsWallet(prev => prev + 1000);
      addActivity("Check-in điểm danh nhận xu", "coins", "1000 xu", "wallet");
    } else if (mission === "profile") {
      localStorage.setItem("mission_profile_done", "true");
      setProfileDone(true);
      setCoinsWallet(prev => prev + 500);
      addActivity("Hoàn thành hồ sơ dệt nôi nhận xu", "coins", "500 xu", "wallet");
    } else if (mission === "blogRead") {
      localStorage.setItem("mission_blogread_done", "true");
      setBlogReadDone(true);
      setCoinsWallet(prev => prev + 200);
      addActivity("Nhịp đọc dệt mộc nhân xu", "coins", "200 xu", "wallet");
    }
  };

  const handleSubmitProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim() || !userAddress.trim()) {
      setProfileFormError("Vui lòng nhập đầy đủ số điện thoại và địa chỉ.");
      return;
    }
    if (userPhone.trim().length < 9) {
      setProfileFormError("Số điện thoại không hợp lệ (ít nhất 9 chữ số).");
      return;
    }
    
    // Save info in localStorage profile
    const profileKey = `lenhandmade_user_${currentUser.id}_profile`;
    const updated = { ...currentUser, phone: userPhone.trim(), address: userAddress.trim() };
    localStorage.setItem(profileKey, JSON.stringify(updated));

    setProfileFormError("");
    setIsExpandingProfile(false);
    handleClaimCoins("profile");
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-24 px-4 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header title */}
        <div className="pb-6 border-b border-brand-primary/10 flex flex-col sm:flex-row items-baseline justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary block mb-1">✦ Sổ hộ nôi khách ✦</span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-brand-fb">Tài Khoản Mỹ Học</h1>
            <p className="font-sans text-xs sm:text-sm text-brand-fb/60 mt-1">Nơi Nàng kiểm soát số xu dệt lụa tích lũy, các cuộc hẹn dã ngoại và thẻ bồi thưởng.</p>
          </div>

          <button
            onClick={() => {
              logoutUser();
              navigate("/login");
            }}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs lg:text-sm font-bold px-4 lg:px-5 py-2.5 lg:py-3 rounded-full border border-red-100 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut size={13} />
            Đăng xuất
          </button>
        </div>

        {/* Dashboard split content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* PROFILE CARD & WALLET SUMMARY */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-brand-primary/10 p-4 lg:p-5 space-y-6 text-center">
            <div className="space-y-4">
              {/* Avatar từ Google đăng nhập */}
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"}
                alt={currentUser?.name}
                className="w-10 h-10 flex-shrink-0 mx-auto rounded-full object-cover ring-2 ring-white ring-offset-2 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="text-center">
                <h3 className="font-sans font-bold text-base lg:text-lg text-brand-fb mt-4 mb-2">{currentUser?.name || "Source Nguyen"}</h3>
                <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-3 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider block w-fit mx-auto">
                  {currentUser?.role === "customer" ? "Nàng Thơ Dệt Chỉ" : "Nhân viên Backoffice"}
                </span>
              </div>
            </div>

            {/* Wallet balance checkout info */}
            <div className="bg-brand-bg/50 p-4 rounded-2xl border border-brand-primary/5 space-y-1 text-center">
              <span className="text-[10px] lg:text-xs text-brand-fb/55 uppercase font-sans font-bold block mb-1">Ví Xu Tích Lũy</span>
              <div className="flex items-center justify-center gap-1.5 text-brand-primary">
                <Sparkles size={16} className="animate-pulse" />
                <strong className="font-mono text-2xl lg:text-3xl font-black">{coinsWallet.toLocaleString("vi-VN")} xu</strong>
              </div>
              <p className="text-[10px] text-brand-fb/45 leading-relaxed pt-1 border-t border-brand-primary/5 mt-2 font-sans select-none">
                * Tốc dệt: Quy đổi 1 xu = 1đ VND lúc check-out giảm ngân sách.
              </p>
            </div>

            <div className="space-y-2 text-left text-xs font-sans text-brand-fb/60 pb-1 pt-1.5">
              <div className="flex items-center gap-2">
                <Calendar size={13} className="text-brand-primary shrink-0" />
                <span>Ngày tham gia: 30 Tháng 5, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={13} className="text-brand-primary shrink-0" />
                <span>Hạng thành viên: Khách hàng Kim Cương</span>
              </div>
            </div>
          </div>

          {/* COINS MISSION & ACCUMULATION CHECKS */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-brand-primary/10 p-4 lg:p-5 space-y-6">
            <h3 className="font-serif font-bold text-sm lg:text-base text-brand-fb flex items-center gap-1.5 border-b border-brand-primary/5 pb-3">
              <Gift size={16} className="text-brand-primary" />
              Nhiệm Vụ Nhận Xu Dệt Thường
            </h3>

            <div className="space-y-4">
              {/* Mission 1 check-in */}
              <div className="p-4 lg:p-5 rounded-2xl bg-white border border-brand-primary/5 flex items-center justify-between text-left shadow-sm">
                <div className="space-y-1 text-left min-w-0 pr-4">
                  <h4 className="font-serif font-bold text-xs lg:text-sm text-brand-fb">Điểm danh ngày mới lãng mạn</h4>
                  <p className="text-[10px] lg:text-sm text-brand-fb/50 leading-relaxed font-sans">Click điểm danh điểm danh tích lộc khâu tay thêu mác.</p>
                  <span className="inline-block text-[9px] lg:text-xs text-brand-primary font-bold font-mono tracking-wider uppercase bg-brand-primary/10 px-2 py-0.5 rounded-full">+1,000 xu dệt</span>
                </div>
                {checkInDone ? (
                  <span className="text-green-600 font-bold text-xs lg:text-sm font-sans flex items-center gap-1 shrink-0 bg-green-50 px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-full select-none">
                    <CheckCircle2 size={13} /> Nhận rồi
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaimCoins("checkin")}
                    className="bg-brand-primary hover:bg-brand-primary-light text-white text-[11px] lg:text-sm font-sans font-bold px-4 lg:px-5 py-2 lg:py-2.5 rounded-full cursor-pointer transition-transform shrink-0"
                  >
                    Điểm danh
                  </button>
                )}
              </div>

              {/* Mission 2 Profile */}
              <div className="p-4 lg:p-5 rounded-2xl bg-white border border-brand-primary/5 flex flex-col gap-3 shadow-sm text-left">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-left min-w-0 pr-4">
                    <h4 className="font-serif font-bold text-xs lg:text-sm text-brand-fb">Bổ sung profile dệt lầu</h4>
                    <p className="text-[10px] lg:text-sm text-brand-fb/50 leading-relaxed font-sans">Cung cấp số điện thoại và địa chỉ giao nhận của bạn để hoàn thiện hồ sơ.</p>
                    <span className="inline-block text-[9px] lg:text-xs text-brand-primary font-bold font-mono tracking-wider uppercase bg-brand-primary/10 px-2 py-0.5 rounded-full">+500 xu dệt</span>
                  </div>
                  {profileDone ? (
                    <span className="text-green-600 font-bold text-xs font-sans flex items-center gap-1 shrink-0 bg-green-50 px-3.5 py-1.5 rounded-full select-none">
                      <CheckCircle2 size={13} /> Nhận rồi
                    </span>
                  ) : (
                    !isExpandingProfile && (
                      <button
                        onClick={() => setIsExpandingProfile(true)}
                        className="bg-brand-primary hover:bg-brand-primary-light text-white text-[11px] lg:text-sm font-sans font-bold px-4 lg:px-5 py-2 lg:py-2.5 rounded-full cursor-pointer transition-transform shrink-0"
                      >
                        Bổ sung ngay
                      </button>
                    )
                  )}
                </div>

                {/* Profile entry fields shown beautifully */}
                {isExpandingProfile && !profileDone && (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmitProfileForm}
                    className="border-t border-brand-primary/5 pt-3 mt-1.5 space-y-3"
                  >
                    {profileFormError && (
                      <div className="flex items-center gap-1.5 p-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-sans">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>{profileFormError}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs lg:text-sm font-sans font-medium text-brand-fb/60 flex items-center gap-1">
                          <Phone size={10} /> Số điện thoại:
                        </label>
                        <input
                          type="tel"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="Nhập sđt (Ví dụ: 0912345678)"
                          className="w-full text-xs font-sans border border-brand-primary/15 bg-[#FAF6F0]/20 rounded-xl px-3 py-1.8 text-brand-fb placeholder-brand-fb/30 outline-none focus:border-brand-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs lg:text-sm font-sans font-medium text-brand-fb/60 flex items-center gap-1">
                          <MapPin size={10} /> Địa chỉ dệt nhận:
                        </label>
                        <input
                          type="text"
                          value={userAddress}
                          onChange={(e) => setUserAddress(e.target.value)}
                          placeholder="Ví dụ: 252 Lý Tự Trọng, Q1, HCM"
                          className="w-full text-xs font-sans border border-brand-primary/15 bg-[#FAF6F0]/20 rounded-xl px-3 py-1.8 text-brand-fb placeholder-brand-fb/30 outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpandingProfile(false);
                          setProfileFormError("");
                        }}
                        className="text-xs lg:text-sm font-sans font-bold text-brand-fb/55 hover:text-brand-fb px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-brand-primary/10"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-brand-primary hover:bg-brand-primary-light text-white text-xs lg:text-sm font-sans font-bold px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-lg shadow-sm"
                      >
                        Nạp hồ sơ &amp; Nhận 500 xu
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>

              {/* Mission 3 Read Blog */}
              <div className="p-4 lg:p-5 rounded-2xl bg-white border border-brand-primary/5 flex items-center justify-between text-left shadow-sm">
                <div className="space-y-1 text-left min-w-0 pr-4">
                  <h4 className="font-serif font-bold text-xs lg:text-sm text-brand-fb">Mở đọc bài viết tạp chí lãng mạn</h4>
                  <p className="text-[10px] lg:text-sm text-brand-fb/50 leading-relaxed font-sans">Truy cập mộc thư họa để tiếp nhận tri thức làm túi gối handmade thêu sợi hoa nhài.</p>
                  <span className="inline-block text-[9px] lg:text-xs text-brand-primary font-bold font-mono tracking-wider uppercase bg-brand-primary/10 px-2 py-0.5 rounded-full">+200 xu dệt</span>
                </div>
                {blogReadDone ? (
                  <span className="text-green-600 font-bold text-xs lg:text-sm font-sans flex items-center gap-1 shrink-0 bg-green-50 px-3.5 lg:px-4 py-1.5 lg:py-2 rounded-full select-none">
                    <CheckCircle2 size={13} /> Nhận rồi
                  </span>
                ) : isBlogCompleted ? (
                  <button
                    onClick={() => handleClaimCoins("blogRead")}
                    className="bg-[#CEAF75] hover:bg-[#CEAF75]/90 text-white text-[11px] lg:text-sm font-sans font-bold px-4 lg:px-5 py-2 lg:py-2.5 rounded-full cursor-pointer transition-transform shrink-0 flex items-center gap-1 animation-bounce"
                  >
                    <Sparkles size={11} /> Nhận 200 xu dệt
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/blog")}
                    className="bg-brand-primary/10 hover:bg-brand-primary/15 text-brand-primary text-[11px] lg:text-sm font-sans font-bold px-4 lg:px-5 py-2 lg:py-2.5 rounded-full cursor-pointer transition-transform shrink-0"
                  >
                    Đọc báo ngay
                  </button>
                )}
              </div>
            </div>

            {/* List vouchers list code copies clipboards */}
            <div className="pt-6 border-t border-brand-primary/5 space-y-4 text-left">
              <h4 className="font-serif font-bold text-xs lg:text-sm text-brand-fb uppercase tracking-wider block">Mã Vouchers Sẵn Đúc Nồi</h4>
              
              <div className="p-4 lg:p-5 bg-brand-bg rounded-2xl border border-brand-primary/5 flex items-center justify-between">
                <div className="space-y-1">
                  <strong className="text-brand-primary font-mono text-sm lg:text-base block">WELCOME20</strong>
                  <span className="text-[10px] lg:text-sm text-brand-fb/60 font-sans block">Chiết khấu 20% giảm kịch trần 100K VND trọn gói đơn đầu.</span>
                </div>
                <button
                  onClick={() => handleCopyCode("WELCOME20")}
                  className="bg-white hover:bg-brand-primary/10 text-brand-primary border border-brand-primary/10 hover:border-brand-primary text-[11px] lg:text-sm font-sans font-bold px-3.5 lg:px-4 py-2 lg:py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  {copiedCode === "WELCOME20" ? (
                    <>
                      <CheckCircle2 size={11} className="text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={11} />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
