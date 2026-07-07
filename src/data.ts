import { Product, Category, Review, BlogPost } from "./types";
import cachBaoQuanLenImg from "./assets/images/cachbaoquanlen.png";
import phoiDoImg from "./assets/images/phoido.png";
import goiYMonQuaLenImg from "./assets/images/goiymonqualen.png";
import yNghiaImg from "./assets/images/ynghia.png";
import goiGonYeThuongImg from "./assets/images/goigonyethuong.png";
import monQuaGiuaBanThanImg from "./assets/images/monquagiuabanthan.png";
import gocNhoImg from "./assets/images/gocnho.png";
import monQuaLenYNghiaImg from "./assets/images/monqualenynghiax.png";

export const CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Túi len handmade",
    description: "Túi len đi học, đi chơi và đi biển với hoa văn, màu sắc có thể làm theo sở thích.",
    image: "/products/sanpham4.4.jpg",
    slug: "tui-len"
  },
  {
    id: "cat_2",
    name: "Hoa len",
    description: "Hoa hồng, hoa tulip, hướng dương và bó hoa len dệt tay giữ sắc xuân vĩnh cửu.",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=600",
    slug: "hoa-len"
  },
  {
    id: "cat_3",
    name: "Phụ kiện len",
    description: "Bóp mini, móc khóa và phụ kiện len nhỏ xinh dành cho túi xách, balo hoặc quà tặng.",
    image: "/products/sanpham2.2.jpg",
    slug: "phu-kien"
  },
  {
    id: "cat_4",
    name: "Thú bông / Amigurumi",
    description: "Những nhân vật len đáng yêu được móc thủ công tỉ mỉ, phù hợp làm quà tặng mini.",
    image: "/products/sanpham3.2.jpg",
    slug: "gau-bong"
  },
  {
    id: "cat_5",
    name: "Khăn len",
    description: "Khăn choàng cổ, găng tay dệt vân cổ điển phong cách ấm áp từ chất liệu len lông cừu hảo hạng.",
    image: "https://images.unsplash.com/photo-1517242046021-82ee19d4a410?auto=format&fit=crop&q=80&w=600",
    slug: "khan-len"
  },
  {
    id: "cat_6",
    name: "Quà tặng handmade",
    description: "Hộp quà sinh nhật, quà tặng Thầy Cô, đồ trang trí Giáng Sinh & Tết đệt tay đầy chân thành.",
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=600",
    slug: "qua-tang"
  },
  {
    id: "cat_7",
    name: "Áo len thủ công",
    description: "Áo len móc tay cho mùa hè, có thể phối màu và điều chỉnh số đo theo sở thích.",
    image: "/products/sanpham1.1.jpg",
    slug: "ao-len"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "new_butterfly_top",
    slug: "ao-len-buom-handmade",
    name: "Áo len bướm handmade",
    price: 100000,
    priceLabel: undefined,
    priceMin: 100000,
    priceMax: 199000,
    requiresQuote: true,
    rating: 5,
    reviewsCount: 0,
    badge: "Mới",
    image: "/products/sanpham1.1.jpg",
    images: [
      "/products/sanpham1.1.jpg",
      "/products/sanpham1.2.jpg",
      "/products/sanpham1.3.jpg"
    ],
    caption: "Áo len bướm chưa bao giờ hết hot 🆘🆘\nMọi người có thể mix màu 🌈 theo sở thích nè.",
    category: "Áo len thủ công",
    description: "Áo len bướm handmade với thiết kế trẻ trung, nổi bật và có thể phối màu theo sở thích. Phù hợp để đi chơi, chụp ảnh, đi biển hoặc phối cùng chân váy và quần jean.",
    shopNote: "Nhắn tiệm để chọn bảng màu và gửi số đo trước khi bắt đầu móc.",
    tags: ["áo len", "áo len bướm", "handmade", "mix màu", "crochet top"],
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    stockStatus: "made-to-order",
    material: "Len Cotton Milk mềm, thoáng",
    colors: [
      { name: "Nâu cacao", hex: "#8C5E45" },
      { name: "Hồng pastel", hex: "#DDB8B0" },
      { name: "Mix màu tự chọn", hex: "#C9A86A" }
    ],
    sizes: ["Đặt theo số đo"],
    materials: [{ name: "Cotton Milk", priceModifier: 0 }],
    stock: 99
  },
  {
    id: "new_mini_pouch",
    slug: "bop-len-mini-xinh-xinh",
    name: "Bóp len mini xinh xinh",
    price: 50000,
    priceLabel: undefined,
    priceMin: 50000,
    priceMax: 99000,
    requiresQuote: false,
    rating: 5,
    reviewsCount: 0,
    badge: "Mới",
    image: "/products/sanpham2.2.jpg",
    images: ["/products/sanpham2.2.jpg", "/products/sanpham2.1.jpg"],
    caption: "🎀 Chiếc bóp bé xinh xinh để đựng băng cá nhân, dây thun, son mini và những món đồ cần thiết hằng ngày.",
    category: "Phụ kiện len",
    description: "Bóp len mini nhỏ gọn, dễ thương, phù hợp để đựng đồ cá nhân nhỏ như băng cá nhân, dây thun, son mini hoặc các vật dụng cần thiết hằng ngày.",
    shopNote: "Có thể chọn màu len và kiểu nút cài theo sở thích.",
    tags: ["bóp len", "ví len", "phụ kiện handmade", "quà tặng nhỏ", "đồ len dễ thương"],
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    stockStatus: "made-to-order",
    material: "Len Cotton mềm",
    colors: [
      { name: "Hồng dâu", hex: "#E78AA7" },
      { name: "Xanh lá", hex: "#4E8B62" },
      { name: "Cam san hô", hex: "#FF7F73" }
    ],
    sizes: ["Mini"],
    materials: [{ name: "Cotton 4ply", priceModifier: 0 }],
    stock: 99
  },
  {
    id: "new_sunflower_bag",
    slug: "tui-len-di-hoc-di-choi-di-bien",
    name: "Túi len đi học, đi chơi, đi biển",
    price: 200000,
    priceLabel: undefined,
    priceMin: 200000,
    priceMax: 299000,
    requiresQuote: true,
    rating: 5,
    reviewsCount: 0,
    badge: "Mới",
    image: "/products/sanpham4.4.jpg",
    images: [
      "/products/sanpham4.4.jpg",
      "/products/sanpham4.1.jpg",
      "/products/sanpham4.2.jpg",
      "/products/sanpham4.3.jpg"
    ],
    caption: "Go to school, library, park, cafe, everywhere with this bag.\nMùa này đi biển thì chiếc túi này là lựa chọn xinh xắn để đồng hành trong những bức hình. ☀️🏝️🌊",
    category: "Túi len handmade",
    description: "Chiếc túi len tiện dụng có thể đồng hành khi đi học, đi thư viện, đi công viên, đi cafe hoặc đi biển. Phù hợp với nhiều phong cách và có thể chọn hoa văn, màu sắc theo sở thích.",
    shopNote: "Bạn có thể inbox để chọn hoa văn, màu sắc như ý. Nếu chưa biết chọn mẫu nào, tiệm sẽ tư vấn phối màu.",
    tags: ["túi len", "túi đi biển", "túi handmade", "túi đi học", "crochet bag", "boho bag"],
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    stockStatus: "made-to-order",
    material: "Len Cotton dày giữ phom",
    colors: [
      { name: "Hoa hướng dương pastel", hex: "#F2C96D" },
      { name: "Nền kem", hex: "#FFFDF8" },
      { name: "Phối màu tự chọn", hex: "#DDB8B0" }
    ],
    sizes: ["Tiêu chuẩn", "Đặt kích thước riêng"],
    materials: [{ name: "Cotton giữ phom", priceModifier: 0 }],
    stock: 99
  },
  {
    id: "prod_1",
    name: "Túi Len Hồng Handmade - Premium Edition",
    price: 380400,
    oldPrice: 450000,
    rating: 5.0,
    reviewsCount: 42,
    badge: "Bán chạy",
    image: "/src/assets/images/crochet_bag_1779458906901.png",
    category: "Túi len handmade",
    description: "Tác phẩm túi len thủ công cao cấp dệt tay tỉ mỉ với họa tiết hoa nổi, quai đeo phối dây gỗ tự nhiên và lót lụa mềm mượt bên trong.",
    material: "Sợi dệt thô Cotton Nhật tinh chế",
    colors: [
      { name: "Hồng Pastel", hex: "#FCDEE3" },
      { name: "Kem Sữa", hex: "#FFFBF2" },
      { name: "Tím Nhạt", hex: "#E9E3F8" },
      { name: "Xanh Sage", hex: "#D6E5D8" }
    ],
    sizes: ["Tiêu chuẩn (22cm)", "Cỡ vừa (28cm) (+40K)"],
    materials: [
      { name: "Len Cotton Nhật Organic", priceModifier: 0 },
      { name: "Len Lông Cừu Milk Cotton cao cấp", priceModifier: 30000 }
    ],
    stock: 12
  },
  {
    id: "prod_8",
    name: "🦋✨ Fairyland Butterfly Vest ✨🦋",
    price: 420000,
    oldPrice: 490000,
    rating: 5.0,
    reviewsCount: 0,
    badge: "Mới",
    image: "https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/480174522_579886578384101_897295009964855956_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1440&ctp=s1440x1440&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH1W2ZTPx5qm2gF7aMWLAA922gWvFj5CajbaBa8WPkJqPchbebXogQA5v9pA1XuSTx9jkA7Dot3dV-sE4_vkBA9&_nc_ohc=_nO6eH5juYUQ7kNvwG1jnXw&_nc_oc=Adrf2Blk4MBnljZTOz1M1RSPdyYpdSFtVkg1WwVFt6S_pNmx8lT6SHOovz8tE-LExnNwj_3hR49soFMbpn8ClY6P&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=zCzqVXnNoQ13mJ62xaWwFA&_nc_ss=7f2a8&oh=00_Af9oiEAUOGAJgbQ1khTGiaLtdkCz-Rt45XehX4N1Mb6-sQ&oe=6A304613",
    images: [
      "/products/butterfly-vest-1.jpg",
      "/products/butterfly-vest-2.jpg",
      "/products/butterfly-vest-3.jpg",
      "https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/480174522_579886578384101_897295009964855956_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1440&ctp=s1440x1440&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH1W2ZTPx5qm2gF7aMWLAA922gWvFj5CajbaBa8WPkJqPchbebXogQA5v9pA1XuSTx9jkA7Dot3dV-sE4_vkBA9&_nc_ohc=_nO6eH5juYUQ7kNvwG1jnXw&_nc_oc=Adrf2Blk4MBnljZTOz1M1RSPdyYpdSFtVkg1WwVFt6S_pNmx8lT6SHOovz8tE-LExnNwj_3hR49soFMbpn8ClY6P&_nc_zt=23&_nc_ht=scontent.fsgn2-8.fna&_nc_gid=zCzqVXnNoQ13mJ62xaWwFA&_nc_ss=7f2a8&oh=00_Af9oiEAUOGAJgbQ1khTGiaLtdkCz-Rt45XehX4N1Mb6-sQ&oe=6A304613"
    ],
    caption: "Tiệm len nhỏ comeback bằng mụt chiếc áo quá là mơi 💓💓💓",
    category: "Áo len handmade",
    description: "Áo vest bướm cổ tích dệt móc tay tỉ mỉ, cánh bướm hai bên bay bổng nhẹ nhàng mỗi khi di chuyển. Hoàn hảo cho mùa hè mộng mơ.",
    material: "Sợi len Cotton Milk 5ply cao cấp",
    colors: [
      { name: "Xanh Bạc Hà", hex: "#B2EBE0" },
      { name: "Vàng Kem Nhạt", hex: "#FFF8DC" },
      { name: "Hồng Nhạt", hex: "#FFD6E0" }
    ],
    sizes: ["S (dưới 50kg)", "M (50–60kg) (+30K)", "L (60–70kg) (+60K)"],
    materials: [
      { name: "Sợi Milk Cotton 5ply", priceModifier: 0 },
      { name: "Sợi Cottton Organic mịn hơn", priceModifier: 50000 }
    ],
    stock: 5
  },
  {
    id: "prod_9",
    name: "🦋 Shell Butterfly Top 🦋",
    price: 380000,
    rating: 4.9,
    reviewsCount: 0,
    badge: "Mới",
    image: "/products/shell-top-1.jpg",
    images: [
      "/products/shell-top-1.jpg",
      "/products/shell-top-2.jpg"
    ],
    videoEmbed: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F560631802656630%2F&show_text=false&width=267&t=0",
    patternBy: "@lulubunny319",
    caption: "Áo len móc tay thủ công cho mùa hè, áo cho 2 mùa nắng đến rất nắng ở Sài Gòn. ☀️👒\nMn có thể mix màu theo sở thích và số đo vừa với cơ thể của mình nha. 🌈",
    category: "Áo len handmade",
    description: "Shell Butterfly Top – chiếc áo len móc tay thủ công mang hơi thở của mùa hè Sài Gòn. Pattern by @lulubunny319. Có thể mix màu theo sở thích, đặt số đo theo cơ thể.",
    material: "Sợi len Cotton mềm mịn thoáng mát",
    colors: [
      { name: "Xanh Nước Biển", hex: "#87CEEB" },
      { name: "Hồng San Hô", hex: "#FF7F7F" },
      { name: "Vàng Chanh", hex: "#FFF44F" },
      { name: "Trắng Sữa", hex: "#FFFDF5" },
      { name: "Mix màu tự chọn", hex: "linear-gradient(135deg,#FF7F7F,#87CEEB,#FFF44F)" }
    ],
    sizes: ["XS (dưới 45kg)", "S (45–52kg) (+20K)", "M (52–60kg) (+40K)", "L (60–70kg) (+70K)"],
    materials: [
      { name: "Sợi Cotton Summer mát lạnh", priceModifier: 0 },
      { name: "Sợi Bamboo Silk siêu mát", priceModifier: 60000 }
    ],
    stock: 8
  },
  {
    id: "prod_7",
    name: "Hộp Quà Ấm Áp Cho Người Thương",
    price: 350000,
    oldPrice: 395000,
    rating: 5.0,
    reviewsCount: 8,
    badge: "Mới",
    image: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/670463589_917625867943502_2055126697105129803_n.jpg?stp=dst-jpg_tt6&cstp=mx1366x2048&ctp=s1366x2048&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHQcceexqz4c-fyYl2vhVA-A3hGv_FSaV4DeEa_8VJpXmBKCg9gha7t8r_krsh9Dib731Meby53MkAonbIt9DMP&_nc_ohc=ZDkGQNHVvnQQ7kNvwGXlW5Q&_nc_oc=Ado8uqLUJEVyP-ozAE-3elEU94kfThbHQntyYaxuJW5gdyEv_PhspsGZtZAgGUsFtB8WKbnQ0A9K5dfh0NDYe0iR&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=KPR_wHuhcXuhsTAr5PgZrg&_nc_ss=7f2a8&oh=00_Af8tvyQshMRt12p754VAHMz0NaaCO1U6CEQHwww6_62QvQ&oe=6A3032F7",
    category: "Quà tặng handmade",
    description: "Ý tưởng tặng quà cho người thương nè các cậu ơi 💌\nKhông cần cầu kỳ, chỉ cần một món nhỏ xinh mang theo chút ấm áp là đủ làm người ấy mỉm cười rồi 🤍\nTiệm có vài món dễ thương lắm, các cậu ghé xem thử nha 🧶✨",
    material: "Sợi len Milk Cotton 5ply cao cấp",
    colors: [
      { 
        name: "Hồng Ngọt Ngào", 
        hex: "#F4C2C2", 
        image: "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/670463589_917625867943502_2055126697105129803_n.jpg?stp=dst-jpg_tt6&cstp=mx1366x2048&ctp=s1366x2048&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHQcceexqz4c-fyYl2vhVA-A3hGv_FSaV4DeEa_8VJpXmBKCg9gha7t8r_krsh9Dib731Meby53MkAonbIt9DMP&_nc_ohc=ZDkGQNHVvnQQ7kNvwGXlW5Q&_nc_oc=Ado8uqLUJEVyP-ozAE-3elEU94kfThbHQntyYaxuJW5gdyEv_PhspsGZtZAgGUsFtB8WKbnQ0A9K5dfh0NDYe0iR&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=KPR_wHuhcXuhsTAr5PgZrg&_nc_ss=7f2a8&oh=00_Af8tvyQshMRt12p754VAHMz0NaaCO1U6CEQHwww6_62QvQ&oe=6A3032F7" 
      },
      { 
        name: "Xanh Dương Bình Yên", 
        hex: "#829FBC", 
        image: "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/668655263_917625877943501_590328023608238083_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1366x2048&ctp=s1366x2048&_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFiNQunBPDfJGQNFQyUsEPw_6A1_f4gjxL_oDX9_iCPEunR8JApCpqtzyEznAoJTCnWIhwIItkbbBJuy28Vfnfs&_nc_ohc=nrZxUw2rhSAQ7kNvwGEZt93&_nc_oc=AdrmYnMc6wNTg036IscOL5y_WPguv9ENa2Y-jSy3uG3E-Voafd3SPJ-tFIzSoSLVqFFffeEWgjUQibrI1IcfRp-H&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=KTTLhtTUaGyiQ4BD7WDFPA&_nc_ss=7f2a8&oh=00_Af_ifsjth9voOmOpv-I_GaAwNdjWFcVfijVvziQFgXPeJw&oe=6A302FB2" 
      }
    ],
    sizes: ["Tiêu chuẩn", "Đặc chế Hộp Quà (+50K)"],
    materials: [
      { name: "Sợi Milk Cotton cao cấp", priceModifier: 0 }
    ],
    stock: 15
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev_1",
    productId: "new_butterfly_top",
    status: "approved",
    author: "Nguyễn Khánh Linh",
    text: "Sản phẩm thực sự rất rất dệt tay xinh đẹp luôn á! Sợi len sờ mịn không hề ráp, đặc biệt quai gỗ thơm tự nhiên sang trọng cực kì dệt sọc hoa tỉ mỉ dã man. Đóng gói hộp xi măng xinh xắn hương hoa dịu thơm nữa, 5 sao!",
    rating: 5,
    role: "Sinh viên trường ĐH Mỹ Thuật",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    date: "2026-05-18"
  },
  {
    id: "rev_2",
    productId: "new_mini_pouch",
    status: "approved",
    author: "Lê Minh Thảo",
    text: "Bó tulip len màu pastel siêu thơ dã man luôn, mua tặng tốt nghiệp bạn thân mà nó ưng giữ mãi làm kỉ niệm phòng khách hoài. Chăm sóc tư vấn siêu thương xỉu, sẽ ủng hộ dài hạn cho đồ tốt nghiệp tới.",
    rating: 5,
    role: "Khách mua quà tốt nghiệp",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    date: "2026-05-15"
  },
  {
    id: "rev_3",
    productId: "new_sunflower_bag",
    status: "approved",
    author: "Phan Anh Thư",
    text: "Túi len dệt cứng cáp phom cực chuẩn, chất len dệt đanh kĩ lưỡng không bị rão chảy chút nào. Có khóa lót lụa bên trong rất an tâm để son và tai nghe nhỏ. Xuất sắc dệt thủ công Việt Nam quá đỉnh!",
    rating: 5,
    role: "Fashion Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    date: "2026-05-10"
  }
];

export const BLOGS: BlogPost[] = [
  // Cẩm Nang category (3 articles)
  {
    id: "blog_1",
    title: "Cách bảo quản và giặt túi len handmade không bao giờ rão phom",
    slug: "cach-bao-quan-va-giat-tui-len",
    description: "Chia sẻ các mẹo giặt khô, giặt tay dịu nhẹ kết hợp nước xông dệt để giữ những thớ len dệt tay giữ nguyên nếp đan chuẩn phom ban đầu theo năm tháng.",
    category: "Cẩm Nang",
    readTime: "5 phút đọc",
    date: "22 Tháng 5, 2026",
    image: cachBaoQuanLenImg,
    content: `<h3>Giặt đúng cách, túi len đẹp lâu như ngày đầu</h3>
              <p>Một chiếc túi len handmade không chỉ là phụ kiện, mà còn là thành quả của rất nhiều giờ đan móc tỉ mỉ. Chăm sóc sai một chút là túi có thể mất dáng, xù sợi hoặc giãn form. Con người mất công chọn túi đẹp rồi lại tiện tay quăng vào máy giặt, đúng là một vòng đời đầy bi kịch. 🧶</p>
              <h3>1. Giặt tay thật nhẹ với xà phòng dịu nhẹ</h3>
              <p>Ngâm túi trong nước mát hoặc hơi ấm, dùng tay bóp nhẹ để làm sạch. Không chà xát mạnh và không dùng chất tẩy vì có thể làm sợi len khô, xơ và phai màu.</p>
              <h3>2. Không vắt hoặc xoắn túi</h3>
              <p>Sau khi giặt, hãy ép nhẹ để nước thoát bớt rồi dùng khăn sạch thấm khô. Vắt quá mạnh có thể khiến bề mặt len sần sùi, giãn thớ và mất form ban đầu.</p>
              <h3>3. Phơi nằm ngang để giữ dáng</h3>
              <p>Đặt túi trên mặt phẳng thoáng mát, chỉnh lại form trước khi phơi và tránh ánh nắng gắt. Không treo túi khi còn ướt vì sức nặng của nước dễ làm quai và thân túi bị kéo dài.</p>
              <p>Chỉ cần chăm sóc đúng cách, chiếc túi len handmade của bạn sẽ luôn đẹp bền như ngày đầu tiên bạn đón về.</p>`
  },
  {
    id: "blog_4",
    title: "Bí quyết đan móc len cơ bản cho người mới bắt đầu từ A đến Z",
    slug: "bi-quyet-dan-moc-len-co-ban",
    description: "Hướng dẫn chi tiết các mũi đan cơ bản, cách chọn kim móc, sợi len phù hợp và những lưu ý quan trọng giúp bạn tạo ra sản phẩm len đẹp ngay từ lần đầu.",
    category: "Cẩm Nang",
    readTime: "8 phút đọc",
    date: "18 Tháng 5, 2026",
    image: gocNhoImg,
    content: "Đan móc len là nghệ thuật tuyệt vời mà ai cũng có thể học được...\n\n1. Chọn kim móc size phù hợp với độ dày sợi.\n2. Học mũi xích, mũi đơn, mũi kép cơ bản.\n3. Luyện tập đều tay qua các mẫu đơn giản."
  },
  {
    id: "blog_5",
    title: "Bí Mật Sau Mỗi Cuộn Len: Cotton, Merino, Mohair Và Alpaca Khác Nhau Thế Nào?",
    slug: "cach-chon-soi-len-phu-hop",
    description: "Khám phá sự khác biệt giữa len Milk Cotton, len acrylic, len lông cừu và cách lựa chọn loại sợi tốt nhất cho túi xách, thú bông hay áo len của bạn.",
    category: "Cẩm Nang",
    readTime: "6 phút đọc",
    date: "10 Tháng 5, 2026",
    image: monQuaLenYNghiaImg,
    content: "Mỗi cuộn len nằm ngoan ngoãn trên kệ đều cất giấu một giấc mơ chưa được kể. Thế nhưng, giữa vô vàn sắc màu và chất liệu, chọn sai len giống như việc chọn nhầm nhạc cụ cho một bản tình ca. Hãy cùng điểm qua những \"vũ khí\" hoàn hảo nhất cho từng dự án của bạn nhé:\n\nSợi Cotton (\"Nàng thơ\" mùa hè): Mát mẻ, ít xù lông và lên mũi móc cực kỳ sắc nét. Đây là mảnh ghép hoàn hảo cho thú bông amigurumi, túi xách vintage hay các món đồ mùa hè.\n\nLen Lông Cừu - Merino (Cái ôm mùa đông): Vô cùng ấm áp, xốp nhẹ và không gây ngứa ngáy. Chân ái của những chiếc áo cổ lọ và khăn quàng cổ (nhớ giặt tay nhẹ nhàng nhé!).\n\nMohair & Alpaca (Đám mây lãng mạn): Bồng bềnh với lớp lông tơ mờ ảo tuyệt đẹp. Sinh ra để dành cho những chiếc áo khoác hờ, khăn mỏng bay bổng hoặc chập cùng len khác để tăng độ ấm.\n\nAcrylic & Sợi Pha (Người bạn bền bỉ): Bảng màu vô tận, giá thành nhẹ nhàng và cực kỳ dễ chăm sóc (có thể giặt máy). Lựa chọn an toàn tuyệt vời cho người mới bắt đầu hoặc để móc chăn sofa."
  },

  // Ý Nghĩa Quà category (4 articles)
  {
    id: "blog_2",
    title: "Gợi ý chọn quà tặng len thủ công cực chất cho mùa tốt nghiệp & sinh nhật",
    slug: "goi-y-chon-qua-tang-len",
    description: "Giải mã thông điệp ngôn ngữ của các sắc hoa len tulip, hướng dương thêu nơ giúp bạn đan gửi tình cảm chân thành độc nhất vô nhị gửi người tri âm.",
    category: "Ý Nghĩa Quà",
    readTime: "4 phút đọc",
    date: "15 Tháng 5, 2026",
    image: goiYMonQuaLenImg,
    content: `<h3>Vì sao một món quà len lại "nặng ký" hơn một món quà mua sẵn?</h3>
              <p>Các món quà từ sợi len đan móc tay mộc mạc luôn mang một hơi thở ấm áp đặc trưng mà đồ công nghiệp khó lòng sao chép được. Mỗi mũi đan là một khoảng thời gian người tặng dành riêng cho người nhận — điều mà không cửa hàng nào bán được bằng tiền.</p>
              <h3>Giải mã "ngôn ngữ" của từng loại hoa len</h3>
              <p>Hoa tulip len đại diện cho sự kiêu hãnh và một tình cảm lãng mạn vừa chớm nở, rất hợp để tặng người thương trong ngày kỷ niệm. Hoa hướng dương len lại mang thông điệp tích cực, hướng về phía ánh sáng — món quà lý tưởng để động viên bạn bè trong mùa thi hoặc tốt nghiệp.</p>
              <h3>Với bạn thân: chọn sự đáng yêu làm chủ đạo</h3>
              <p>Thú bông Amigurumi tai dài mềm mại, bảng màu pastel nhẹ nhàng là lựa chọn an toàn cho những người bạn thân thiết — vừa đủ dễ thương để đặt trên bàn học, vừa đủ ý nghĩa để nhắc về một tình bạn bền chặt.</p>
              <h3>Với người đặc biệt: đầu tư vào chi tiết cá nhân hóa</h3>
              <p>Một chiếc túi len thêu tên, hoặc bó hoa len phối đúng màu yêu thích của người nhận, sẽ khiến món quà trở nên "chỉ dành riêng cho họ". Đừng ngại nhắn nhỏ với tiệm để được tư vấn phối màu và thêu chữ miễn phí.</p>
              <h3>Mẹo chọn quà nhanh theo dịp</h3>
              <p>Sinh nhật: ưu tiên màu sắc theo cung hoàng đạo hoặc sở thích cá nhân. Tốt nghiệp: chọn tông màu trang trọng như be, nâu đất hoặc xanh rêu. Tri ân thầy cô: một bó hoa len nhỏ kèm thiệp viết tay luôn là lựa chọn không bao giờ lỗi mốt.</p>`
  },
  {
    id: "blog_6",
    title: "Ý nghĩa sâu sắc của hoa len handmade trong các dịp đặc biệt",
    slug: "y-nghia-hoa-len-handmade",
    description: "Khám phá ý nghĩa tinh thần đằng sau mỗi loại hoa len - từ hoa hồng biểu trưng tình yêu đến hoa cẩm chướng tượng trưng lòng biết ơn người mẹ.",
    category: "Ý Nghĩa Quà",
    readTime: "5 phút đọc",
    date: "12 Tháng 5, 2026",
    image: yNghiaImg,
    content: `<h3>Vì sao hoa len lại được chọn thay hoa tươi trong nhiều dịp?</h3>
              <p>Mỗi bông hoa len không chỉ đẹp mà còn mang thông điệp riêng, và quan trọng hơn cả — nó không tàn. Trong khi hoa tươi chỉ giữ được vài ngày, một bó hoa len có thể ở lại trên bàn học, góc phòng hay bàn làm việc suốt nhiều năm, như một lời nhắc nhớ bền bỉ về người đã tặng.</p>
              <h3>Hoa hồng len: Tình yêu bất diệt</h3>
              <p>Sắc đỏ của hoa hồng len tượng trưng cho một tình yêu không phai màu theo thời gian — khác với hoa hồng thật vốn chỉ nở rộ rồi héo úa. Đây là lựa chọn phổ biến nhất cho các dịp kỷ niệm, cầu hôn hoặc ngày Valentine.</p>
              <h3>Hoa cẩm chướng len: Lòng biết ơn</h3>
              <p>Cẩm chướng từ lâu đã gắn liền với hình ảnh người mẹ. Một bó cẩm chướng len tặng mẹ vào ngày Vu Lan hay 8/3 mang ý nghĩa "con luôn nhớ ơn dưỡng dục", đồng thời có thể lưu giữ được lâu hơn nhiều so với hoa cắt cành.</p>
              <h3>Hoa lavender len: Sự thanh thản và chữa lành</h3>
              <p>Với tông tím dịu nhẹ, lavender len thường được chọn làm quà cho những người đang cần được an ủi — sau một giai đoạn khó khăn, một cuộc chia tay, hay đơn giản là một ngày mệt mỏi. Nó không hô hào, chỉ lặng lẽ ở đó như một lời động viên nhẹ nhàng.</p>
              <h3>Hoa hướng dương len: Niềm tin và sự lạc quan</h3>
              <p>Hướng dương luôn quay về phía mặt trời, vì vậy loài hoa này thường được tặng cho ai đó đang bắt đầu một hành trình mới — nhập học, chuyển việc, hoặc cần thêm động lực để bước tiếp.</p>
              <h3>Chọn hoa theo đúng câu chuyện bạn muốn kể</h3>
              <p>Thay vì chọn hoa chỉ vì đẹp, hãy nghĩ đến câu chuyện bạn muốn gửi gắm: một lời cảm ơn, một sự an ủi, hay một tình yêu bền lâu. Tiệm Len Nhỏ luôn sẵn sàng tư vấn phối màu và loại hoa phù hợp nhất với thông điệp riêng của bạn.</p>`
  },
  {
    id: "blog_7",
    title: "Quà tặng thú bông len cho bé - Món quà an toàn và đầy yêu thương",
    slug: "qua-tang-thu-bong-len-cho-be",
    description: "Tại sao thú bông Amigurumi len handmade là món quà hoàn hảo cho trẻ em - an toàn, mềm mại và chứa đựng tình cảm của người làm từng mũi đan.",
    category: "Ý Nghĩa Quà",
    readTime: "4 phút đọc",
    date: "05 Tháng 5, 2026",
    image: goiGonYeThuongImg,
    content: "Thú bông len handmade là món quà tuyệt vời cho bé...\n\n- Chất liệu an toàn, không độc hại.\n- Mềm mại, ấm áp.\n- Mỗi sản phẩm đều là duy nhất."
  },
  {
    id: "blog_8",
    title: "Túi len handmade - Món quà thời trang bền vững cho người bạn thân",
    slug: "tui-len-handmade-qua-tang-ben-vung",
    description: "Khám phá lý do túi len handmade trở thành xu hướng quà tặng được yêu thích - kết hợp giữa thời trang, thân thiện môi trường và ý nghĩa cá nhân.",
    category: "Ý Nghĩa Quà",
    readTime: "5 phút đọc",
    date: "28 Tháng 4, 2026",
    image: monQuaGiuaBanThanImg,
    content: "Túi len không chỉ là phụ kiện thời trang mà còn là lời nhắn yêu thương...\n\n- Thân thiện môi trường.\n- Phong cách cá nhân hoá.\n- Bền bỉ theo năm tháng."
  },

  // Xu Hướng category
  {
    id: "blog_3",
    title: "Cách phối đồ với túi len cực xinh xu hướng nàng thơ Soft-Girl hiện đại",
    slug: "cach-phoi-do-voi-tui-len-cuc-xinh",
    description: "Biến hóa phong cách hằng ngày từ năng động trẻ trung tới phong cách vintage dịu dàng quyến rũ dạo phố thơ cùng bản phối túi len Boho đan vân hoa đào.",
    category: "Xu Hướng",
    readTime: "6 phút đọc",
    date: "08 Tháng 5, 2026",
    image: phoiDoImg,
    content: "Phong cách Soft-Girl kết hợp với các bộ trang phục đầm xòe hay sơ mi họa tiết mộc mạc...\n\n- Chọn các loại túi tone màu đất hoặc pastel thơ mộng.\n- Kết hợp cùng kẹp hoa cúc hoặc mác gỗ mộc mạc."
  }
];
