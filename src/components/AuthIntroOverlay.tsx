import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

export default function AuthIntroOverlay() {
  const { currentUser } = useApp();
  const [show, setShow] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const seen = sessionStorage.getItem(`lenhandmade_intro_seen_${currentUser.id}`);
      if (!seen) {
        setShow(true);
        setDismissing(false);
      } else {
        setShow(false);
      }
    } else {
      setShow(false);
    }
  }, [currentUser]);

  // Handle manual or automatic completion of the curtain intro
  const handleDismiss = () => {
    if (dismissing) return;
    setDismissing(true);
    
    // Play transition rotation and slide transition, then remove from viewport
    setTimeout(() => {
      if (currentUser) {
        sessionStorage.setItem(`lenhandmade_intro_seen_${currentUser.id}`, "true");
      }
      setShow(false);
      setDismissing(false);
    }, 1200); // Wait for the custom 1.2s splitting curtain effect
  };

  useEffect(() => {
    if (show && !dismissing) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, dismissing]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex select-none pointer-events-auto">
      
      {/* Left Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: dismissing ? "-100%" : 0 }}
        transition={{ duration: 1.0, ease: [0.77, 0, 0.175, 1] }}
        className="w-1/2 h-full bg-[#FAF6F0] border-r border-[#543D32]/10 relative flex items-center justify-end"
      >
        {/* Subtle grid pattern in fabric background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5dcce_1.2px,transparent_1.5px)] [background-size:20px_20px] opacity-40" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 z-20">
          {/* Soft watercolor rose highlight */}
          <div className="absolute -inset-10 bg-[#FBCFCF]/30 rounded-full blur-2xl" />
        </div>
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: dismissing ? "100%" : 0 }}
        transition={{ duration: 1.0, ease: [0.77, 0, 0.175, 1] }}
        className="w-1/2 h-full bg-[#FAF6F0] border-l border-[#543D32]/10 relative flex items-center justify-start"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#e5dcce_1.2px,transparent_1.5px)] [background-size:20px_20px] opacity-40" />
      </motion.div>

      {/* Floating Centered Branding Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: dismissing ? 0.9 : 1, 
            opacity: dismissing ? 0 : 1,
            rotate: dismissing ? 360 : 0
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          onClick={handleDismiss}
          className="flex flex-col items-center justify-center cursor-pointer p-10 rounded-[40px] bg-white/70 backdrop-blur-md border border-[#543D32]/10 shadow-[0_24px_64px_rgba(65,44,32,0.08)] max-w-sm text-center"
        >
          {/* Beautiful custom vector logo matching the user's artwork */}
          <Logo size={200} animate={true} />

          <p className="font-sans text-[11px] text-[#412C20]/45 tracking-widest uppercase mt-4">
            Sợi Chỉ Thêu Dệt Yêu Thương
          </p>

          <div className="w-12 h-[1px] bg-[#543D32]/25 my-4" />

          {currentUser && (
            <p className="font-sans text-[11px] text-[#CEAF75] font-bold tracking-wider">
              XIN CHÀO, {currentUser.name.toUpperCase()}
            </p>
          )}

          <span className="text-[9px] font-sans text-[#412C20]/45 uppercase tracking-[0.15em] block mt-4 animate-pulse">
            Click vào logo hoặc đợi 5s để khám phá
          </span>
        </motion.div>
      </div>

    </div>
  );
}
