"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Coffee,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Star,
  ChevronDown,
  Menu,
  X,
  Send,
  Heart,
  Flame,
  Leaf,
  Award,
  Users,
  Wifi,
  Car,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

/* ──────────────────────────── data ──────────────────────────── */

const NAV_LINKS = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang", href: "#tentang" },
  { label: "Menu", href: "#menu" },
  { label: "Galeri", href: "#galeri" },
  { label: "Lokasi", href: "#lokasi" },
];

const FEATURES = [
  {
    icon: Coffee,
    title: "Kopi Premium",
    desc: "Biji kopi pilihan dari petani lokal Minangkabau, dipanggang sempurna setiap hari.",
  },
  {
    icon: Flame,
    title: "Makanan Segar",
    desc: "Menu makanan yang dibuat fresh dengan bahan-bahan berkualitas dan resep autentik.",
  },
  {
    icon: Leaf,
    title: "Suasana Asri",
    desc: "Interior hangat dengan sentuhan tanaman tropis, menciptakan nuansa nyaman dan menenangkan.",
  },
  {
    icon: Award,
    title: "Rating 4.6/5",
    desc: "Dipercaya ribuan pengunjung sebagai salah satu cafe terbaik di Kota Padang.",
  },
];

interface MenuItem {
  name: string;
  price: string;
  desc: string;
  image?: string;
  popular?: boolean;
}

const MENU_DATA: Record<string, MenuItem[]> = {
  kopi: [
    { name: "Menes Signature Latte", price: "28K", desc: "Espresso dengan susu steamed dan latte art khas Menes", popular: true, image: "/cafe-images/coffee-latte.png" },
    { name: "Americano", price: "20K", desc: "Double shot espresso dengan air panas", image: "/cafe-images/coffee-latte.png" },
    { name: "Cappuccino", price: "25K", desc: "Espresso, steamed milk, dan foam lembut", popular: true, image: "/cafe-images/coffee-latte.png" },
    { name: "Mocha", price: "28K", desc: "Espresso dengan cokelat dan susu kental", image: "/cafe-images/coffee-latte.png" },
    { name: "Es Kopi Susu Gula Aren", price: "22K", desc: "Es kopi dengan susu segar dan gula aren asli", popular: true, image: "/cafe-images/iced-coffee.png" },
    { name: "Vanilla Latte", price: "28K", desc: "Espresso dengan vanilla syrup dan susu", image: "/cafe-images/iced-coffee.png" },
    { name: "Caramel Macchiato", price: "30K", desc: "Vanilla, susu, espresso, dan karamel drizzle", image: "/cafe-images/iced-coffee.png" },
    { name: "Affogato", price: "25K", desc: "Espresso panas disiram di atas gelato vanilla", image: "/cafe-images/coffee-latte.png" },
  ],
  nonkopi: [
    { name: "Matcha Latte", price: "25K", desc: "Matcha premium Jepang dengan susu segar", popular: true, image: "/cafe-images/iced-coffee.png" },
    { name: "Taro Latte", price: "25K", desc: "Taro asli dengan susu creamy", image: "/cafe-images/iced-coffee.png" },
    { name: "Thai Tea", price: "22K", desc: "Thai tea otentik dengan susu kental", image: "/cafe-images/iced-coffee.png" },
    { name: "Chocolate Bliss", price: "25K", desc: "Cokelat Belgia hangat dengan marshmallow", image: "/cafe-images/iced-coffee.png" },
    { name: "Lemon Tea", price: "18K", desc: "Teh dengan irisan lemon segar dan madu", image: "/cafe-images/iced-coffee.png" },
    { name: "Red Velvet Latte", price: "28K", desc: "Red velvet dengan cream cheese foam", popular: true, image: "/cafe-images/iced-coffee.png" },
  ],
  makanan: [
    { name: "Nasi Goreng Menes", price: "25K", desc: "Nasi goreng spesial dengan telur dan ayam suwir", popular: true, image: "/cafe-images/food-menu.png" },
    { name: "Mie Goreng Jawa", price: "23K", desc: "Mie goreng bumbu Jawa dengan sayuran segar", image: "/cafe-images/food-menu.png" },
    { name: "Roti Bakar Cokelat", price: "18K", desc: "Roti panggang dengan selai cokelat premium", image: "/cafe-images/food-menu.png" },
    { name: "Indomie Rebus Spesial", price: "20K", desc: "Indomie dengan topping telur dan sayuran", popular: true, image: "/cafe-images/food-menu.png" },
    { name: "Nasi Ayam Geprek", price: "28K", desc: "Nasi dengan ayam geprek sambal level adjustable", image: "/cafe-images/food-menu.png" },
    { name: "French Fries", price: "18K", desc: "Kentang goreng crispy dengan saus pilihan", image: "/cafe-images/food-menu.png" },
    { name: "Pisang Goreng Keju", price: "20K", desc: "Pisang goreng crispy dengan lelehan keju", image: "/cafe-images/food-menu.png" },
    { name: "Roti John", price: "25K", desc: "Roti isi daging sapi dan telur dengan saus istimewa", image: "/cafe-images/food-menu.png" },
  ],
  snack: [
    { name: "Pisang Cokelat Lumer", price: "18K", desc: "Pisang panggang dengan lelehan cokelat dan keju", popular: true, image: "/cafe-images/desserts.png" },
    { name: "Brownies Panggang", price: "22K", desc: "Brownies cokelat panggang homemade", image: "/cafe-images/desserts.png" },
    { name: "Croissant Butter", price: "20K", desc: "Croissant renyah dengan butter premium", image: "/cafe-images/desserts.png" },
    { name: "Pancake Stack", price: "25K", desc: "Stack pancake lembut dengan maple syrup dan buah", image: "/cafe-images/desserts.png" },
  ],
};

const GALLERY_IMAGES = [
  { src: "/cafe-images/hero.png", alt: "Interior Menes Coffee" },
  { src: "/cafe-images/coffee-latte.png", alt: "Latte Art Menes" },
  { src: "/cafe-images/barista.png", alt: "Barista Menes Coffee" },
  { src: "/cafe-images/food-menu.png", alt: "Menu Makanan Menes" },
  { src: "/cafe-images/cafe-exterior.png", alt: "Eksterior Menes Coffee" },
  { src: "/cafe-images/iced-coffee.png", alt: "Iced Coffee Menes" },
];

const REVIEWS = [
  {
    name: "Rina Safitri",
    text: "Tempat nongkrong paling nyaman di Padang! Kopi signature-nya juara banget, suasananya bikin betah seharian.",
    rating: 5,
  },
  {
    name: "Ahmad Fauzi",
    text: "Menu makanannya lengkap dan harganya terjangkau. WiFi kencang, cocok buat kerja atau nugas.",
    rating: 5,
  },
  {
    name: "Dian Permata",
    text: "Gimana cara nggak balik lagi? Tempatnya aesthetic, makanannya enak, harganya ramah di kantong!",
    rating: 5,
  },
];

/* ──────────────────────────── animation helpers ──────────────────────────── */

function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const dir = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
  }[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dir }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────── main page ──────────────────────────── */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 600);

      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* ═══════ NAVBAR ═══════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("beranda")}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-full bg-coffee-800 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-serif font-bold text-lg tracking-tight transition-colors ${
                  scrolled ? "text-coffee-900" : "text-white"
                }`}
              >
                Menes
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.2em] -mt-0.5 transition-colors ${
                  scrolled ? "text-coffee-500" : "text-white/80"
                }`}
              >
                Coffee & Eatery
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href.replace("#", ""))}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? scrolled
                        ? "bg-coffee-100 text-coffee-800"
                        : "bg-white/20 text-white"
                      : scrolled
                        ? "text-coffee-700 hover:bg-coffee-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className={`ml-2 rounded-full ${
                    scrolled
                      ? "bg-coffee-800 hover:bg-coffee-900 text-white"
                      : "bg-white text-coffee-900 hover:bg-white/90"
                  }`}
                >
                  Reservasi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">
                    Reservasi Meja
                  </DialogTitle>
                  <DialogDescription>
                    Isi formulir di bawah untuk melakukan reservasi meja di
                    Menes Coffee & Eatery.
                  </DialogDescription>
                </DialogHeader>
                <ReservationForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ${
              scrolled
                ? "text-coffee-900 hover:bg-coffee-50"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-coffee-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href.replace("#", ""))}
                    className="block w-full text-left px-4 py-3 rounded-lg text-coffee-800 hover:bg-coffee-50 font-medium transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full rounded-full bg-coffee-800 hover:bg-coffee-900 text-white">
                        Reservasi Meja
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-xl">
                          Reservasi Meja
                        </DialogTitle>
                        <DialogDescription>
                          Isi formulir di bawah untuk melakukan reservasi meja.
                        </DialogDescription>
                      </DialogHeader>
                      <ReservationForm />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════ HERO ═══════ */}
      <section
        id="beranda"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="/cafe-images/hero.png"
            alt="Menes Coffee & Eatery Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge
              variant="secondary"
              className="bg-white/15 text-white border-white/20 backdrop-blur-sm mb-6 text-sm px-4 py-1.5"
            >
              <Coffee className="w-3.5 h-3.5 mr-1.5" />
              Est. Padang, Sumatera Barat
            </Badge>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              Menes
            </h1>
            <p className="text-2xl sm:text-3xl font-serif text-amber-200/90 mb-2">
              Coffee &amp; Eatery
            </p>
            <p className="text-white/70 text-lg sm:text-xl mt-4 mb-8 max-w-2xl mx-auto">
              Tempat nongkrong terbaik di Padang. Nikmati kopi premium, makanan
              lezat, dan suasana yang bikin betah seharian.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-coffee-700 hover:bg-coffee-800 text-white rounded-full px-8 text-base shadow-lg"
                onClick={() => scrollTo("menu")}
              >
                Lihat Menu
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 text-base backdrop-blur-sm"
                onClick={() => scrollTo("lokasi")}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Kunjungi Kami
              </Button>
            </div>
          </motion.div>
        </div>
        {/* scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </section>

      <main>
        {/* ═══════ FEATURES ═══════ */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 0.1}>
                  <Card className="border-0 shadow-none hover:shadow-md transition-shadow duration-300 text-center p-6">
                    <CardContent className="p-0 flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-coffee-100 flex items-center justify-center">
                        <f.icon className="w-7 h-7 text-coffee-700" />
                      </div>
                      <h3 className="font-serif font-bold text-lg text-coffee-900">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.desc}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ ABOUT ═══════ */}
        <section id="tentang" className="py-20 sm:py-28 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <FadeIn direction="left">
                <div className="relative">
                  <img
                    src="/cafe-images/barista.png"
                    alt="Barista Menes Coffee"
                    className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-coffee-800 text-white rounded-xl px-5 py-3 shadow-lg">
                    <p className="font-serif font-bold text-2xl">#BeMore</p>
                    <p className="text-coffee-200 text-xs">Our Philosophy</p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction="right">
                <div>
                  <Badge className="bg-coffee-100 text-coffee-700 border-coffee-200 mb-4">
                    Tentang Kami
                  </Badge>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-900 mb-6">
                    Cerita di Balik Setiap Cangkir
                  </h2>
                  <div className="space-y-4 text-coffee-700/80 leading-relaxed">
                    <p>
                      <strong className="text-coffee-900">Menes Coffee & Eatery</strong> hadir
                      di jantung Kota Padang sebagai tempat dimana kopi, kuliner, dan
                      komunitas bertemu. Berlokasi di Jl. Kartini No. 24, kami
                      menghadirkan pengalaman ngopi yang lebih dari sekadar minum kopi.
                    </p>
                    <p>
                      Nama &quot;Menes&quot; terinspirasi dari filosofi Minangkabau yang
                      mengajak kita untuk terus berkembang dan menjadi versi terbaik
                      diri sendiri — itulah makna di balik tagline kami{" "}
                      <strong className="text-coffee-900">#BeMore</strong>.
                    </p>
                    <p>
                      Dengan jam operasional dari pagi hingga dini hari (09.00 - 03.00),
                      kami menjadi rumah kedua bagi mahasiswa, pekerja, dan siapa saja
                      yang mencari suasana nyaman dengan kopi berkualitas.
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-6">
                    <div className="text-center">
                      <p className="font-serif text-3xl font-bold text-coffee-800">7K+</p>
                      <p className="text-xs text-muted-foreground mt-1">Pengikut Instagram</p>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="text-center">
                      <p className="font-serif text-3xl font-bold text-coffee-800">4.6</p>
                      <p className="text-xs text-muted-foreground mt-1">Rating Google</p>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="text-center">
                      <p className="font-serif text-3xl font-bold text-coffee-800">18</p>
                      <p className="text-xs text-muted-foreground mt-1">Jam Operasional</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ═══════ MENU ═══════ */}
        <section id="menu" className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="bg-coffee-100 text-coffee-700 border-coffee-200 mb-4">
                  <Coffee className="w-3.5 h-3.5 mr-1" />
                  Menu Kami
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-900 mb-3">
                  Pilihan Rasa untuk Semua
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Dari kopi premium hingga makanan lezat, temukan favoritmu di sini.
                  Semua menu dibuat dengan bahan-bahan berkualitas.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <Tabs defaultValue="kopi" className="w-full">
                <TabsList className="w-full flex h-auto bg-coffee-50 p-1 rounded-xl mb-8">
                  <TabsTrigger
                    value="kopi"
                    className="flex-1 rounded-lg data-[state=active]:bg-coffee-800 data-[state=active]:text-white py-2.5 text-sm font-medium"
                  >
                    Kopi
                  </TabsTrigger>
                  <TabsTrigger
                    value="nonkopi"
                    className="flex-1 rounded-lg data-[state=active]:bg-coffee-800 data-[state=active]:text-white py-2.5 text-sm font-medium"
                  >
                    Non-Kopi
                  </TabsTrigger>
                  <TabsTrigger
                    value="makanan"
                    className="flex-1 rounded-lg data-[state=active]:bg-coffee-800 data-[state=active]:text-white py-2.5 text-sm font-medium"
                  >
                    Makanan
                  </TabsTrigger>
                  <TabsTrigger
                    value="snack"
                    className="flex-1 rounded-lg data-[state=active]:bg-coffee-800 data-[state=active]:text-white py-2.5 text-sm font-medium"
                  >
                    Snack
                  </TabsTrigger>
                </TabsList>

                {Object.entries(MENU_DATA).map(([category, items]) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item, idx) => (
                        <MenuCard key={item.name} item={item} index={idx} />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </FadeIn>
          </div>
        </section>

        {/* ═══════ GALLERY ═══════ */}
        <section id="galeri" className="py-20 sm:py-28 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="bg-coffee-100 text-coffee-700 border-coffee-200 mb-4">
                  Galeri
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-900 mb-3">
                  Suasana di Menes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Intip suasana cozy dan aesthetic yang menanti kamu di Menes Coffee
                  & Eatery.
                </p>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {GALLERY_IMAGES.map((img, i) => (
                <FadeIn key={img.src} delay={i * 0.08}>
                  <div
                    className={`relative group overflow-hidden rounded-xl ${
                      i === 0 || i === 4 ? "md:col-span-2" : ""
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-48 sm:h-64 md:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-3 left-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {img.alt}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ REVIEWS ═══════ */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="bg-coffee-100 text-coffee-700 border-coffee-200 mb-4">
                  <Heart className="w-3.5 h-3.5 mr-1" />
                  Testimoni
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-900 mb-3">
                  Apa Kata Mereka?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Cerita dari para pengunjung setia Menes Coffee & Eatery.
                </p>
              </div>
            </FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {REVIEWS.map((review, i) => (
                <FadeIn key={review.name} delay={i * 0.1}>
                  <Card className="border border-coffee-100 hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <StarRating rating={review.rating} />
                      <p className="text-coffee-700/80 mt-4 flex-1 leading-relaxed text-sm">
                        &quot;{review.text}&quot;
                      </p>
                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-coffee-100">
                        <div className="w-10 h-10 rounded-full bg-coffee-200 flex items-center justify-center">
                          <span className="font-serif font-bold text-coffee-800">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-coffee-900">
                            {review.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pengunjung Setia
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ LOCATION ═══════ */}
        <section id="lokasi" className="py-20 sm:py-28 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-12">
                <Badge className="bg-coffee-100 text-coffee-700 border-coffee-200 mb-4">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  Lokasi
                </Badge>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-900 mb-3">
                  Temukan Kami
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Kunjungi kami dan nikmati pengalaman ngopi terbaik di Padang.
                </p>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-2 gap-8">
              <FadeIn direction="left">
                <Card className="border-0 shadow-lg overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] w-full bg-coffee-100 relative">
                      <img
                        src="/cafe-images/cafe-exterior.png"
                        alt="Eksterior Menes Coffee"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-coffee-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-coffee-900">Alamat</p>
                          <p className="text-sm text-muted-foreground">
                            Jl. Kartini No. 24, Padang Pasir, Kota Padang,
                            Sumatera Barat
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-coffee-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-coffee-900">
                            Jam Operasional
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Setiap Hari: 09:00 - 03:00 WIB
                          </p>
                          <Badge
                            variant="secondary"
                            className="mt-1.5 bg-green-100 text-green-700 border-green-200 text-xs"
                          >
                            Buka Sekarang
                          </Badge>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-coffee-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-coffee-900">
                            Telepon / WhatsApp
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Hubungi via Instagram @menescoffee
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Wifi className="w-4 h-4 text-coffee-500" />
                          WiFi Gratis
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Car className="w-4 h-4 text-coffee-500" />
                          Parkir Luas
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-coffee-500" />
                          VIP Room
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
              <FadeIn direction="right">
                <Card className="border-0 shadow-lg overflow-hidden h-full">
                  <CardContent className="p-0 h-full">
                    <iframe
                      title="Lokasi Menes Coffee"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.287!2d100.3543!3d-0.9493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJl.+Kartini+No.24%2C+Padang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                      className="w-full h-full min-h-[400px] border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ═══════ CTA BANNER ═══════ */}
        <section className="py-20 bg-coffee-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-amber-300 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <FadeIn>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                Siap #BeMore Hari Ini?
              </h2>
              <p className="text-coffee-200 text-lg mb-8 max-w-2xl mx-auto">
                Kunjungi Menes Coffee & Eatery dan temukan tempat favoritmu
                untuk bersantai, bekerja, atau sekadar ngopi bersama teman.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-coffee-900 hover:bg-coffee-50 rounded-full px-8 font-semibold"
                  onClick={() => scrollTo("lokasi")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Dapatkan Arah
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-full px-8"
                  asChild
                >
                  <a
                    href="https://www.instagram.com/menescoffee"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Ikuti Instagram
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-coffee-900 text-coffee-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-coffee-700 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-serif font-bold text-lg text-white">
                    Menes
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-coffee-400 -mt-0.5">
                    Coffee & Eatery
                  </span>
                </div>
              </div>
              <p className="text-sm text-coffee-400 leading-relaxed">
                Tempat nongkrong terbaik di Padang. Kopi premium, makanan lezat,
                suasana cozy.
              </p>
              <div className="flex gap-3 mt-4">
                <a
                  href="https://www.instagram.com/menescoffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-coffee-800 hover:bg-coffee-700 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-white mb-4">Navigasi</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href.replace("#", ""))}
                      className="text-sm text-coffee-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-serif font-bold text-white mb-4">
                Jam Buka
              </h4>
              <ul className="space-y-2 text-sm text-coffee-400">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  Setiap Hari
                </li>
                <li className="pl-6">09:00 - 03:00 WIB</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-serif font-bold text-white mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm text-coffee-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  Jl. Kartini No. 24, Padang Pasir, Kota Padang
                </li>
                <li className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 shrink-0" />
                  @menescoffee
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-coffee-800" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-coffee-500">
            <p>&copy; {new Date().getFullYear()} Menes Coffee & Eatery. All rights reserved.</p>
            <p className="font-serif italic">#BeMore</p>
          </div>
        </div>
      </footer>

      {/* ═══════ SCROLL TO TOP ═══════ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-coffee-800 hover:bg-coffee-900 text-white shadow-lg flex items-center justify-center transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────── sub-components ──────────────────────────── */

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Card className="group border border-coffee-100 hover:shadow-md hover:border-coffee-200 transition-all duration-300 overflow-hidden h-full">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative h-36 overflow-hidden">
            <img
              src={item.image || "/cafe-images/coffee-latte.png"}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.popular && (
              <Badge className="absolute top-2 right-2 bg-amber-500 text-white border-0 text-[10px] px-2 py-0.5">
                Popular
              </Badge>
            )}
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-serif font-bold text-sm text-coffee-900 leading-tight">
                {item.name}
              </h4>
              <span className="font-bold text-coffee-700 text-sm whitespace-nowrap">
                {item.price}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex-1">
              {item.desc}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ReservationForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      time: (form.elements.namedItem("time") as HTMLSelectElement).value,
      guests: (form.elements.namedItem("guests") as HTMLSelectElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gagal mengirim reservasi");

      toast.success("Reservasi berhasil dikirim!", {
        description: `Terima kasih ${data.name}, kami akan menghubungi Anda.`,
      });
      form.reset();
    } catch {
      toast.error("Gagal mengirim reservasi", {
        description: "Silakan coba lagi atau hubungi kami via Instagram.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          name="name"
          placeholder="Masukkan nama Anda"
          required
          className="rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">No. WhatsApp</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="08xxxxxxxxxx"
          required
          className="rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="date">Tanggal</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guests">Jumlah Tamu</Label>
          <Select name="guests" defaultValue="2">
            <SelectTrigger className="rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Orang</SelectItem>
              <SelectItem value="2">2 Orang</SelectItem>
              <SelectItem value="3">3 Orang</SelectItem>
              <SelectItem value="4">4 Orang</SelectItem>
              <SelectItem value="5">5 Orang</SelectItem>
              <SelectItem value="6+">6+ Orang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Waktu Kedatangan</Label>
        <Select name="time" defaultValue="19:00">
          <SelectTrigger className="rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
              "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
              "21:00", "22:00", "23:00",
            ].map((t) => (
              <SelectItem key={t} value={t}>
                {t} WIB
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Catatan (opsional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Contoh: meja dekat jendela, ulang tahun, dll."
          rows={2}
          className="rounded-lg resize-none"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-coffee-800 hover:bg-coffee-900 text-white rounded-full"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Mengirim...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Kirim Reservasi
          </span>
        )}
      </Button>
    </form>
  );
}
