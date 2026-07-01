import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot, HelpCircle, ShoppingBag, Truck, CreditCard, Percent, Coins, RotateCcw, Phone, Sparkles, ShieldCheck } from "lucide-react";
import { BRAND_NAME, BRAND_EMAIL, BRAND_FANPAGE, BRAND_PHONE_DISPLAY } from "../constants/brand";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

interface ChatbotProps {
  onShowCategory?: (catName: string) => void;
}

// FAQ intents with display label, icon, action key, and keyword fallback
const FAQ_ITEMS = [
  { text: "Xem túi len", action: "view_bag", icon: ShoppingBag },
  { text: "Tra cứu đơn hàng", action: "order_lookup", icon: Truck },
  { text: "Phí vận chuyển", action: "shipping", icon: Truck },
  { text: "Thanh toán", action: "payment", icon: CreditCard },
  { text: "Mã giảm giá", action: "coupon", icon: Percent },
  { text: "Xu thưởng (Coins)", action: "coins", icon: Coins },
  { text: "Đổi trả", action: "returns", icon: RotateCcw },
  { text: "Bảo quản len", action: "care", icon: Sparkles },
  { text: "Liên hệ", action: "contact", icon: Phone },
  { text: "Bảo hành", action: "warranty", icon: ShieldCheck },
];

export default function Chatbot({ onShowCategory }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init_1",
      sender: "bot",
      text: `Xin chào nàng thơ của ${BRAND_NAME}! Mint là Miu Miu 🧶 — Trợ lý tơ sợi ảo của bạn. Bạn cần tưới thơm, chọn sợi hay học hỏi cách thêu gấm dệt hoa gì thế ạ?`,
      time: "Vừa xong"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const generateBotReply = (text: string, actionType?: string): string => {
    const lower = text.toLowerCase();

    // Product / category inquiry
    if (actionType === "view_bag" || lower.includes("túi len") || lower.includes("mua túi") || lower.includes("sản phẩm") || lower.includes("xem hàng")) {
      onShowCategory?.("Túi len handmade");
      return `Tuyệt quá ạ! 🌟 ${BRAND_NAME} có các mã Túi len dệt tay phối quai gỗ cao cấp thêu hoa nổi rất hot. Mint đã kích hoạt lọc riêng danh mục 'Túi len handmade' cho bạn ở storefront bên trái rồi nhé! Hãy lựa một chiếc xinh sắn nhen.`;
    }

    // Order tracking
    if (actionType === "order_lookup" || lower.includes("đơn hàng") || lower.includes("tra cứu") || lower.includes("order")) {
      return "Để tra cứu đơn hàng, bạn vào mục 'Tra cứu đơn' trên thanh menu (góc phải) hoặc vào Trang chủ > menu chính > Tra cứu đơn. Bạn chỉ cần nhập mã vận đơn hoặc email & số điện thoại là Mint-sẽ hiện trạng thái đơn nhen! 🚚✨";
    }

    // Shipping
    if (actionType === "shipping" || lower.includes("ship") || lower.includes("vận chuyển") || lower.includes("giao hàng") || lower.includes("phí")) {
      return "Len dệt yêu thương, nên phí vận chuyển cũng tràn ngập thương mến! Hiện tại cửa hàng đang GIẢM THẢO MIỄN PHÍ SHIP TRẦN TOÀN QUỐC cho mọi giá trị đơn đặt hàng từ hôm nay đó ạ. Thảnh thơi dệt hoa nhen! 📦💕";
    }

    // Payment methods
    if (actionType === "payment" || lower.includes("thanh toán") || lower.includes("chuyển khoản") || lower.includes("momo") || lower.includes("cod") || lower.includes("tiền mặt")) {
      return "Hiện tại Len hỗ trợ các phương thức thanh toán:\n💳 Chuyển khoản ngân hàng / VietQR\n📱 Ví MoMo\n💵 Thanh toán khi nhận hàng (COD)\nBạn có thể chọn phương thức phù hợp nhất khi đặt hàng ở bước thanh toán ạ!";
    }

    // Coupons / discount codes
    if (actionType === "coupon" || lower.includes("mã giảm") || lower.includes("coupon") || lower.includes("giảm giá") || lower.includes("khuyến mãi") || lower.includes("voucher")) {
      return "Cảm ơn nàng đã quan tâm đến ưu đãi! Len thường xuyên tung mã giảm giá vào các dịp đặc biệt (sinh nhật shop, Black Friday, Trung thu,...). Hãy để mắt đến mục 'Khuyến mãi' trên website hoặc follow fanpage để săn mã siêu xịn nhé! 🎉💝";
    }

    // Coins / loyalty
    if (actionType === "coins" || lower.includes("coin") || lower.includes("xu") || lower.includes("điểm") || lower.includes("tích") || lower.includes("thành viên")) {
      return "Chương trình tích xu (Len Coins) đang hoạt động! Mỗi đơn hàng bạn tích được xu tương ứng với giá trị đơn. Sau đó có thể dùng xu để giảm trực tiếp cho đơn kế tiếp. Càng mua càng rẻ, càng dệt càng vui! 🪙✨";
    }

    // Returns / exchanges
    if (actionType === "returns" || lower.includes("đổi trả") || lower.includes("hoàn trả") || lower.includes("trả hàng") || lower.includes("đổi hàng")) {
      return "An tâm tuyệt đối ạ! Sản phẩm thủ công của chúng mình được bảo trợ bảo hành và HỖ TRỢ ĐỔI TRẢ TRONG 7 NGÀY TRỰC TIẾP nếu len rão phom hoặc màu sắc bị lệch nhiều so với dệt mẫu. Vui lòng giữ hoá đơn và liên hệ fanpage để được hướng dẫn chi tiết ạ! 🔄💕";
    }

    // Handmade care
    if (actionType === "care" || lower.includes("bảo quản") || lower.includes("giặt") || lower.includes("vệ sinh") || lower.includes("phơi") || lower.includes("làm sạch")) {
      return "Cách giữ phom chuẩn nhất là giặt tay bằng nước ấm dịu nhẹ với dầu gội đầu, vò nhẹ thắt phom và ĐẶT NẰM NGANG TRÊN KHĂN KHÔ khi phơi, tuyệt đối không treo móc đứng kẻo thớ len nhão xệ nhé nàng thơ! Khi không dùng, hãy cất trong túi vải thoáng khí, tránh ẩm mốc. 🧺✨";
    }

    // Contact info
    if (actionType === "contact" || lower.includes("liên hệ") || lower.includes("hotline") || lower.includes("sdt") || lower.includes("điện thoại") || lower.includes("địa chỉ") || lower.includes("fanpage") || lower.includes("zalo")) {
      return `${BRAND_NAME} rất vui được kết nối với bạn! 🥰\n📞 Hotline/Zalo: ${BRAND_PHONE_DISPLAY}\n📧 Email: ${BRAND_EMAIL}\n📍 Địa chỉ: TP. Hồ Chí Minh\n💬 Fanpage: ${BRAND_FANPAGE}\nHoặc bạn có thể nhắn tin trực tiếp qua Zalo để được tư vấn nhanh nhất ạ!`;
    }

    // Warranty
    if (actionType === "warranty" || lower.includes("bảo hành") || lower.includes("lỗi") || lower.includes("hỏng") || lower.includes("sửa")) {
      return "Tất cả sản phẩm handmade của Len đều được BẢO HÀNH 30 NGÀY với các lỗi từ nhà sản xuất (bong chỉ, tuột mối, lỗi kỹ thuật). Ngoài ra Len có dịch vụ sửa chữa, gia cố cho các sản phẩm cũ với chi phí hợp lý. Liên hệ fanpage để gửi hình ảnh và được báo giá nhanh nhé! 🛠️💪";
    }

    // Admin help
    if (lower.includes("admin") || lower.includes("quản trị") || lower.includes("dashboard") || lower.includes("quản lý")) {
      return "Truy cập dashboard quản trị tại đường dẫn /admin/dashboard sau khi đăng nhập tài khoản quản trị viên. Tính năng hiện tại: quản lý sản phẩm, đơn hàng, khách hàng, báo cáo doanh thu, kho hàng, blog, thông báo và cài đặt. Nếu cần hỗ trợ thêm, hãy liên hệ đội ngũ kỹ thuật nhé! 👩‍💻";
    }

    // Fallback
    return "Miu Miu ghi nhận thông điệp ý nghĩa ạ! 🧶 Mỗi dải len dập dệt có độ co giãn nhẹ và tinh vân thêu tay độc bản khác nhau. Để được chọn sợi đặt thêu tên chữ cái custom riêng mộc mạc, bạn hãy hoàn tất thủ đặt giỏ dệt hoặc nhắn tin qua Zalo nhé! Bạn cũng có thể chọn câu hỏi gợi ý bên dưới để được tư vấn nhanh hơn ạ 💕";
  };

  const handleSendMessage = (text: string, actionType?: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateBotReply(text, actionType);
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end max-w-[calc(100vw-1.5rem)] sm:max-w-none">

      {/* Chat Dialog Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            className="w-[calc(100vw-24px)] sm:w-[400px] max-h-[75vh] sm:max-h-[520px] bg-brand-card rounded-3xl border border-brand-primary/18 shadow-2xl flex flex-col overflow-hidden mb-3"
          >
            {/* Header — fixed */}
            <div className="flex-shrink-0 bg-brand-primary text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-[44px] h-[44px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Bot size={30} className="text-white" />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-serif font-bold text-sm truncate">Miu Miu 🧶 Trợ Lý</h4>
                  <span className="text-[10px] font-sans text-white/75 block">Trực tuyến dệt sợi...</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors shrink-0"
              >
                <X size={22} />
              </button>
            </div>

            {/* Message area — scrollable */}
            <div
              ref={chatBodyRef}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 bg-[#FFFDFB]/80 scrollbar-thin overscroll-contain"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-start gap-1.5`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-[10px] mt-0.5 select-none font-bold shrink-0">
                      🐱
                    </div>
                  )}
                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words max-w-[300px] sm:max-w-[320px] ${
                      msg.sender === "user"
                        ? "bg-brand-primary text-white rounded-tr-none"
                        : "bg-brand-bg/90 border border-brand-primary/5 text-brand-fb rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-brand-fb/30 mt-0.5 font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-[10px] select-none font-bold shrink-0">
                    🐱
                  </div>
                  <div className="bg-brand-bg/60 px-3 py-2.5 rounded-2xl rounded-tl-none border border-brand-primary/5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick action pills — scrollable horizontal */}
            <div className="flex-shrink-0 border-t border-brand-primary/8 bg-white px-5 py-3">
              <span className="text-[10px] font-sans font-bold text-brand-primary tracking-wider uppercase mb-2.5 flex items-center gap-1.5 select-none">
                <HelpCircle size={12} /> Gợi ý nhanh:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                {FAQ_ITEMS.map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.action}
                      onClick={() => handleSendMessage(q.text, q.action)}
                      className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-sans font-medium text-brand-fb hover:text-brand-primary hover:bg-brand-primary/5 border border-brand-primary/10 px-2.5 py-1.5 rounded-lg bg-[#FAF9F5] transition-colors cursor-pointer select-none whitespace-nowrap"
                    >
                      <Icon size={14} className="text-brand-primary/70" />
                      {q.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input area — fixed at bottom */}
            <div className="flex-shrink-0 px-4 py-3 border-t border-brand-primary/8 bg-brand-bg/40 flex items-center gap-2.5">
              <input
                type="text"
                placeholder="Nhắn dệt thương với Miu Miu..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }
                }}
                className="flex-1 text-sm font-sans px-4 py-2.5 rounded-xl bg-white border border-brand-primary/15 outline-none focus:border-brand-primary text-brand-fb placeholder-brand-fb/40 min-w-0"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="p-3 bg-brand-primary hover:bg-brand-primary-light disabled:bg-brand-primary/40 text-white rounded-xl transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"
                title="Gửi"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-brand-primary hover:bg-brand-primary-light text-white flex items-center justify-center shadow-2xl relative z-50 cursor-pointer group hover:shadow-brand-primary/30 hover:shadow-lg transition-all shrink-0"
        title="Trò chuyện với Miu Miu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 45 }}>
              <X size={30} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative">
              <MessageCircle size={30} />
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full w-4 h-4 text-[8px] font-bold text-white flex items-center justify-center animate-bounce border-2 border-white">
                1
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute inset-0 rounded-full border-2 border-brand-primary animate-ping opacity-30 -z-10" />
        )}
      </motion.button>
    </div>
  );
}
