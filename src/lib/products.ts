export type Product = {
  id: string;
  name: string;
  service: string;
  category: "playstation" | "streaming" | "music" | "games" | "apple" | "vpn";
  duration: string;
  price: number;
  popular?: boolean;
};

export const products: Product[] = [
  // Netflix
  {
    id: "nf-private-1m",
    name: "Netflix شاشة خاصة",
    service: "Netflix",
    category: "streaming",
    duration: "شهر",
    price: 280,
    popular: true,
  },
  {
    id: "nf-shared-1m",
    name: "Netflix شاشة مشتركة",
    service: "Netflix",
    category: "streaming",
    duration: "شهر",
    price: 120,
  },
  {
    id: "nf-shared-3m",
    name: "Netflix شاشة مشتركة",
    service: "Netflix",
    category: "streaming",
    duration: "3 شهور",
    price: 320,
  },
  {
    id: "nf-shared-12m",
    name: "Netflix شاشة مشتركة",
    service: "Netflix",
    category: "streaming",
    duration: "سنة",
    price: 1100,
  },
  // PS Plus
  {
    id: "psp-ess-1m",
    name: "PS Plus Essential",
    service: "PlayStation",
    category: "playstation",
    duration: "شهر",
    price: 250,
  },
  {
    id: "psp-ess-3m",
    name: "PS Plus Essential",
    service: "PlayStation",
    category: "playstation",
    duration: "3 شهور",
    price: 680,
  },
  {
    id: "psp-ext-1m",
    name: "PS Plus Extra",
    service: "PlayStation",
    category: "playstation",
    duration: "شهر",
    price: 420,
    popular: true,
  },
  {
    id: "psp-ext-12m",
    name: "PS Plus Extra",
    service: "PlayStation",
    category: "playstation",
    duration: "سنة",
    price: 3900,
  },
  {
    id: "psp-prem-12m",
    name: "PS Plus Premium",
    service: "PlayStation",
    category: "playstation",
    duration: "سنة",
    price: 4800,
  },
  // Spotify
  {
    id: "spt-ind-1m",
    name: "Spotify Premium Individual",
    service: "Spotify",
    category: "music",
    duration: "شهر",
    price: 90,
  },
  {
    id: "spt-ind-3m",
    name: "Spotify Premium Individual",
    service: "Spotify",
    category: "music",
    duration: "3 شهور",
    price: 240,
  },
  {
    id: "spt-fam-1m",
    name: "Spotify Premium Family",
    service: "Spotify",
    category: "music",
    duration: "شهر",
    price: 180,
  },
  // Disney
  {
    id: "dis-1m",
    name: "Disney+",
    service: "Disney+",
    category: "streaming",
    duration: "شهر",
    price: 200,
  },
  {
    id: "dis-3m",
    name: "Disney+",
    service: "Disney+",
    category: "streaming",
    duration: "3 شهور",
    price: 540,
  },
  // YouTube
  {
    id: "yt-1m",
    name: "YouTube Premium",
    service: "YouTube",
    category: "music",
    duration: "شهر",
    price: 120,
  },
  {
    id: "yt-3m",
    name: "YouTube Premium",
    service: "YouTube",
    category: "music",
    duration: "3 شهور",
    price: 320,
  },
  // Shahid
  {
    id: "sh-1m",
    name: "Shahid VIP",
    service: "Shahid",
    category: "streaming",
    duration: "شهر",
    price: 150,
  },
  {
    id: "sh-12m",
    name: "Shahid VIP",
    service: "Shahid",
    category: "streaming",
    duration: "سنة",
    price: 1300,
  },
  // Apple
  {
    id: "ap-icl-200",
    name: "iCloud 200GB",
    service: "Apple",
    category: "apple",
    duration: "شهر",
    price: 90,
  },
  {
    id: "ap-one",
    name: "Apple One",
    service: "Apple",
    category: "apple",
    duration: "شهر",
    price: 280,
  },
  // PUBG
  {
    id: "pubg-660",
    name: "PUBG 660 UC",
    service: "PUBG Mobile",
    category: "games",
    duration: "فوري",
    price: 380,
    popular: true,
  },
  {
    id: "pubg-1800",
    name: "PUBG 1800 UC",
    service: "PUBG Mobile",
    category: "games",
    duration: "فوري",
    price: 950,
  },
  {
    id: "pubg-3850",
    name: "PUBG 3850 UC",
    service: "PUBG Mobile",
    category: "games",
    duration: "فوري",
    price: 1900,
  },
  // Free Fire
  {
    id: "ff-530",
    name: "Free Fire 530 Diamond",
    service: "Free Fire",
    category: "games",
    duration: "فوري",
    price: 320,
  },
  // Xbox
  {
    id: "xb-ult-1m",
    name: "Xbox Game Pass Ultimate",
    service: "Xbox",
    category: "games",
    duration: "شهر",
    price: 450,
  },
];

export const categories = [
  { id: "all", label: "الكل" },
  { id: "playstation", label: "بلايستيشن" },
  { id: "streaming", label: "ستريمينج" },
  { id: "music", label: "موسيقى" },
  { id: "games", label: "ألعاب" },
  { id: "apple", label: "Apple" },
] as const;

export const WA_NUMBERS = ["201109664083", "201014956483"];
export const waLink = (num: string, msg?: string) =>
  `https://wa.me/${num}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
