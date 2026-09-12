export type Category = "HYPER-RUNNING" | "AVANT-GARDE" | "LAB EXPERIMENTAL";

/* Single source of truth for USD display price → VND. */
export const USD_TO_VND = 25_000;

export interface Product {
  slug: string;
  sku: string;
  name: string;
  series: string;
  price: number;
  category: Category;
  status: "LIVE" | "UPCOMING" | "SOLD OUT";
  edition: string;
  description: string;
  materials: string[];
  image: string;
  colors: string[];
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

/* Ảnh Stitch gốc (aida-public) — dùng cho toàn bộ site */
export const STITCH = {
  k09: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKMHELlXfmNzxocRGSAjON35prEgJPZjsYlAfMKYCCfqwxd6aY4-uUNR1HA8yK7HcQUcK8kaNyQqCRIJCynxLP9tXsHuN4Yaezbo1jTrLvU9KMzBCQDmlBCgU-so9ekm3ZowgOXeNobEtioZunVf3Q-NhJQguHlMsPtPxCdJ421Z3X9JGV814NN-FbLpO6r3fmdp-RW4d4cKCq4WMTkwFv6InA7O7aUqJILUqSN8BCyiVHAG9xPMT9hQ=s1600",
  k07: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ_OZmGr3GbWgsJCHn1nTSHOv-hcKMjcr8Z00VKaOhGIHa2SFsQuYPj7Pdc253Ha_rvmxFd7LztDgrhhWyfw8I9Bl1_n-9rpzdUcYv4hqRwYnadh1ErQGCTV6ObX1391p8pjZSyXG4G5QOuM_in_7BoZXPkL-q9mhDkUVWcCfwJJCaMzNI3ckyyShLmYu33TYJcGlqCir2ouHQsRtSHsNfJYiztF0VH9GibIRtgWMasKEp-zLlPyfYAw=s1600",
  k01: "https://lh3.googleusercontent.com/aida-public/AB6AXuBz8-yeFEDeIs-jAZZUXAtuDXnLaZ4VQTdmNHN_i75Wz4_y8ZbFa0mg_dTqPjhLXzTWcOOZ6-NGSZlQvvmxR5Vv_UROzhF10dy8llDAXshnW9CBujWmLrF9jm5WXUJntMCLRjgacxpCiYnfdETcR594K7igdMFTMrV26AUrmCEirGPSNBsOns-oWWzZX94Pj6s7ZzFjOTBtBkB52BdNo9HmcftMlzxlmcauVvwA0-PKJgrGKMWw_AlZew=s1600",
  k12: "https://lh3.googleusercontent.com/aida-public/AB6AXuCg0NuGsXVSyXjXfl0SYe3nQxUZbXJJTOfffTQAHjxBSaVkBnbV7cfcTouVsD76cxQd5TSXZZurhODLRQDTybn8ek8JNksJ0BhiY9GNXM7n15PjMaC0K4SBa1zJSbxk1XedaHSjyuj3UUM9NmcphRYlGVpN0nvRqEelC7Vck7vTpunxL12JR8IAioTcQ2fLkcvbUU_bvO0Yps8v5F526Cbu91AxO2zHTqbFr3GzuSyNqixUmL9qBLSZ6g=s1600",
  macro: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwXkxDC-Ee-xe4H3g4W8wNp9YowY8lBpgt1YbBzsvaRHAxZnXokPQl395mlSwNrbf3flExkYJ0tySCCdXJQHCP3wj_knmYjQNQD8M9kH3isFy34jLEtmYcWzCWPM6JvchTFceS6h-hYbxB4iaH43Z9wD6rFSH1VpMOyq40xTEa5GYzwFZqbY3dKKc_pKSzq6k8jWBrjI8czfUGn8BKJmJFH8Y5YGn940rimeXFjAKw-pElPJMcoDv8Dw=s1600",
  lab: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgUvQZchaRXP6_hlo-Zigs6FSdxvLMvZC6OMRYhuNBdgxufZmv1ab5AqBwGSRWUGcvhCUKjAuTBRtZCy7VXZaRYCiBYkcb7hRXWtU3Q6PZBbGTtcVwajQH66sD3xi_4QXet4KgwFNwpob6rmOVXNr-XXLyTIiJ8t_3hs-xeSw5mlUNL895j3-Vpz2jcfpDdC-7prYRjb7OBCg82FQ8VmfRC7ecM_ESM23Yzx4WBHvI721rFHsR1G_GVA=s1600",
  g1: "https://lh3.googleusercontent.com/aida-public/AB6AXuACHHeBKZoeVLUcp_IXhulVQGt1TyeOgRcbBhpGQNxBhrCQa5L4h0Q1SPL1opCA05QcRF37XbjtSLW1BmkMXlVQOiVoH_4QKxjOkROOZgJfxn1TgzvGuBiZ_xMJBzV5CJ6biKjC0W6pqqoT0aEcrA4zxO8eSCNuowFg0825A25LA9aVH_-Wp2pWwskNZIMfqRN2QL8Z40AxyDtCk6F9iOHwf_WXh1HssCqBpZeZxifQFUYrICF_uuSihA=s1600",
  g2: "https://lh3.googleusercontent.com/aida-public/AB6AXuA32zLZywY03KfDkVptNAPeGO35z70iG-xFbt3W6rqQ1ipoGvnZt_SmF1SqxzkEAFnsjl0KjpZ832rwYZ46XV5ev_aTUeT1dkv75tYFVGOSA3PxRY8lLAg_U30O1neGBr6K8Iv8Uvl7WPFMhJCXauhqI1mTbnYXEs_V4Vi43urFAS3W4viyqbTTqRo8y9JL7V3r0RvzTZ3lE5-bYkGNEH0wkplhm6PPAoB-bqY-r-8MV8tmx6uUeScvZg=s1600",
  g3: "https://lh3.googleusercontent.com/aida-public/AB6AXuBX1ZUIlDTg55RFPqQfQFsEwgoiE9TeNfmfYc_Ae2G6DMngvMbM-4BNzsRXCXiI-PuR2pmCB91wk1E0KeaWq4nIl2euJcDXZbkpE6wV6L5vVh-peAWg1ALPQONsCegUQMuBAFXKqyfZFw8awrnsdJ3yVZn3DdkKqz88XSwy-f75fDl6qn7xNszl1flXXOvrYy_gdmnfAA-4SmU-BkbsORPrVo98m3RBfqMmYfY4yQNkJsoWt6rzVKt9uw=s1600",
  g4: "https://lh3.googleusercontent.com/aida-public/AB6AXuDK8bHRqDg2Fz2uqv-JE8KC-GWiXS29g_nJENO08C6piU7e59QX3WXdJvMOCJSSnqKmpozY5ifSD0k8zcnfhGnBXbrsRo8aIg8iHcB2ZFbQKU46E-J_1Kdc22IIdgStuTeHI2UR3NhUEMnVhBb5zgITmqSEykce_B1aDs1d6eBspK6adXytRUEKPb2xdIeizYebaSxOW7bMfLuWjoqmMTffiA5iZDDVc5fDGaXHdkvnu9uvj_VUNhZ6RQ=s1600",
  g5: "https://lh3.googleusercontent.com/aida-public/AB6AXuBT4a4JGDb--tyS4MQW-xQ4s5PJzlhManF3bJFlCK4sjWGx5TKj0JhbB2vq6c3RM6TjNEO-o-ussgXKELfvupd21jFsPUbhImRBHmBKc7LP3XDJOVeOtBMLiQMHjx6kpRyhed29A6bLmv7EKLlyVrejbsaHxzJL--Vc-yY0H6fJVhPXkCiLQPX5PtfBL2ahCrgYdLTjV3Q5PD48WxxP2fkOqOqDtihtSyH1ioKW-jc6jzDLjSp76hfbIA=s1600",
  g6: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7qYA74loXcZ7FiQhavUlQyQ-7uUhsLW5cr51qj-NxS89Pmcnskrv3bZFx40PltIJQssdUR3TDH7YIjdWtC9R9pGdTAI2vXO79U9h2FCyrGGmiGxqd9fnuMXC1zooi3ODD42PJnB9XPjv3r1DavpEAcx6YreGzZF-3JZFaYDKNDcIDUvLhryDqr-238kNjsEVGBlFK50fMnHm93EhREm48Janz9VzmmoHFf1MIkIM7K0zHckn-v-zNsQ=s1600",
};


export const IMAGES = {
  hero: STITCH.k09,
  heroAlt: STITCH.k07,
  lab: STITCH.lab,
  macro: STITCH.macro,
  darkTech: STITCH.g3,
  carbon: STITCH.g4,
  tokyo: STITCH.g5,
  paris: STITCH.g6,
  store: STITCH.g1,
  editorial: img("photo-1469334031218-e382a71b716b", 900),
  monochrome: img("photo-1529139574466-a303027c1d8b", 900),
  techwear: img("photo-1550614000-4895a10e1bfd", 900),
  avant: img("photo-1507680434567-5739c80be1ac", 900),
  lookTokyo: img("photo-1542931287-023b922fa89b", 1000),
  lookParis: img("photo-1490114538077-0a7f8cb49891", 1000),
  lookMilan: img("photo-1515886657613-9f3515b0c78f", 1000),
  lookSeoul: img("photo-1524504388940-b1c1722653e1", 1000),
  avatar: img("photo-1507003211169-0a1dd7228f2d", 200),
};

export const PRODUCTS: Product[] = [
  {
    slug: "k-09-stratos-chrono",
    sku: "KNS-K09-004-VOLT",
    name: "K-09 STRATOS CHRONO",
    series: "SERIES 09 // PROTO SPEC",
    price: 680,
    category: "LAB EXPERIMENTAL",
    status: "LIVE",
    edition: "142/500 REMAINING",
    description:
      "Silhouette thí nghiệm No.09 — khung sợi carbon nguyên khối, khóa đệm Titanium Grade 5 và dây shock-cord volt phát quang. Giới hạn 500 đôi toàn cầu.",
    materials: ["Carbon nguyên khối", "Titanium Grade 5", "Ripstop Polymer", "Nitrogen Foam"],
    image: STITCH.k09,
    colors: ["VOLT", "CHROME", "NOIR"],
  },
  {
    slug: "k-07-solaris-glitch",
    sku: "KNS-K07-007-CHROME",
    name: "K-07 SOLARIS GLITCH",
    series: "SERIES 07 // LIQUID CHROME",
    price: 740,
    category: "AVANT-GARDE",
    status: "LIVE",
    edition: "18 PAIRS REMAINING",
    description:
      "Bề mặt phủ thủy ngân lỏng quang học biến sắc cùng túi đệm khí điều áp kỹ thuật số. Đỉnh cao kỹ thuật tạo hình điêu khắc.",
    materials: ["Liquid Mercury TPU", "Air Chamber"],
    image: STITCH.k07,
    colors: ["CHROME", "VOLT"],
  },
  {
    slug: "k-01-phantom-shadow",
    sku: "KNS-K01-001-BLK",
    name: "K-01 PHANTOM SHADOW",
    series: "SERIES 01 // PROTO SPEC",
    price: 590,
    category: "HYPER-RUNNING",
    status: "SOLD OUT",
    edition: "SOLD OUT // WAITLIST",
    description:
      "Sợi dệt chống đạn Ballistic 1000D kết hợp khoá hít nam châm đa hướng. Thiết kế tĩnh lặng hoàn toàn trong bóng đêm.",
    materials: ["Cordura Ballistic", "Magnetic Lock"],
    image: STITCH.k01,
    colors: ["NOIR"],
  },
  {
    slug: "k-12-titan-runner",
    sku: "KNS-K12-012-TITAN",
    name: "K-12 TITAN RUNNER",
    series: "SERIES 12 // BIOMECHANICAL",
    price: 620,
    category: "HYPER-RUNNING",
    status: "UPCOMING",
    edition: "PRE-ORDER // LÔ 02",
    description:
      "Khuyên xỏ dây gia công Titanium thô nguyên khối cùng hệ đế phản lực Volt năng động.",
    materials: ["Titanium", "Mesh"],
    image: STITCH.k12,
    colors: ["VOLT", "NOIR"],
  },
  {
    slug: "k-04-aero-drift",
    sku: "KNS-K04-004-AERO",
    name: "K-04 AERO DRIFT",
    series: "SERIES 04 // RUNWAY",
    price: 720,
    category: "AVANT-GARDE",
    status: "UPCOMING",
    edition: "DROP 05 // SẮP PHÁT HÀNH",
    description:
      "Dáng avant-garde lifestyle cho sàn runway — thân giày điêu khắc bất đối xứng, đế lattice carbon in 3D tham số.",
    materials: ["Parametric Lattice", "Chrome Film"],
    image: STITCH.g1,
    colors: ["CHROME", "VOLT"],
  },
  {
    slug: "k-x-lab-null",
    sku: "KNS-KX-000-NULL",
    name: "K-X LAB NULL",
    series: "PROTOTYPE // NOT FOR SALE",
    price: 1200,
    category: "LAB EXPERIMENTAL",
    status: "SOLD OUT",
    edition: "ARCHIVE // 12 PAIRS",
    description:
      "Nguyên mẫu phòng lab không mở bán — lưu trữ vĩnh viễn tại vault Milan, trưng bày theo lịch exhibition tour.",
    materials: ["Experimental Weave", "Titanium Exo"],
    image: STITCH.g2,
    colors: ["NOIR"],
  },
];

export const NAV = [
  { index: "01", label: "DISCOVERY", href: "/" },
  { index: "02", label: "ARCHIVE & SHOP", href: "/gallery" },
  { index: "03", label: "THE ARTIFACT", href: "/artifact" },
  { index: "04", label: "MANIFESTO & LOOKBOOK", href: "/lookbook" },
  { index: "05", label: "CART & DISPATCH", href: "/checkout" },
  { index: "06", label: "SYNDICATE VAULT", href: "/vault" },
];

export const SPECS = [
  { title: "CARBON STABILIZATION SHANK", body: "Tấm carbon định hình giữa đế, chống xoắn khi tốc độ cao." },
  { title: "REBOUND NITROGEN FOAM", body: "Đệm nitrogen ép siêu tới hạn, hoàn năng lượng 87%." },
  { title: "SEAMLESS KEVLAR UPPER", body: "Thân Kevlar dệt liền mạch, chịu mài mòn cấp quân sự." },
  { title: "MAGNETIC TITANIUM LACING", body: "Khóa dây nam châm Titanium, thao tác một chạm." },
];

export const STYLES = [
  { title: "AVANT-GARDE FORMALISM", body: "Phối cùng suit cấu trúc tối màu, điểm nhấn chrome.", image: IMAGES.avant },
  { title: "BIOMECHANICAL TECHWEAR", body: "Full techwear đen, harness và túi hộp chức năng.", image: IMAGES.techwear },
  { title: "HAUTE RAW MONOCHROME", body: "Monochrome thô cao cấp, layering vải mộc.", image: IMAGES.monochrome },
];

export const LOOKS = [
  { title: "K-09 FIELD VALIDATION", location: "TOKYO KINETIC LAB", image: IMAGES.editorial },
  { title: "OBSIDIAN PROTOCOL", location: "PARIS ATELIER NUIT", image: IMAGES.lookParis },
  { title: "VOLT DISPATCH", location: "MILAN VAULT RUNWAY", image: IMAGES.lookMilan },
  { title: "CHROME DIVISION", location: "SEOUL NIGHT TEST", image: IMAGES.lookSeoul },
];

export const PROVENANCE = [
  { time: "2025.11.02 — 09:41 JST", event: "Lắp ráp thủ công hoàn tất tại Tokyo Kinetic Lab", hash: "0x8f3a…c41d" },
  { time: "2025.11.04 — 14:02 JST", event: "Quét sinh trắc & đúc hộ chiếu số (mint)", hash: "0x2b7e…9f00" },
  { time: "2025.11.09 — 18:20 CET", event: "Kiểm định Atelier Paris — Craft Index 99.4%", hash: "0x51cd…77ab" },
  { time: "2025.11.12 — 07:55 CET", event: "Niêm phong vault Milan, gắn chip NFC đối chiếu", hash: "0xa090…3e19" },
];

export const TRANSACTIONS = [
  { id: "TX-8841", item: "K-09 STRATOS CHRONO", date: "2025.11.12", status: "ĐÃ NHẬN", total: "$680" },
  { id: "TX-8790", item: "K-07 SOLARIS GLITCH", date: "2025.10.28", status: "ĐÃ NHẬN", total: "$590" },
  { id: "TX-8714", item: "K-01 PHANTOM MATRIX", date: "2025.09.30", status: "KHO MILAN", total: "$590" },
  { id: "TX-8655", item: "K-04 AERO DRIFT", date: "2025.11.20", status: "ĐANG VẬN CHUYỂN", total: "$720" },
];

export const formatUSD = (n: number) =>
  `$${n.toLocaleString("en-US")} USD`;
