import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";
import HowItWorksImg from "../assets/how-it-works.svg";
import { Link } from "react-router-dom";

type Testimonial = {
  id: number;
  title: string;
  text: string;
  name: string;
  location: string;
};

type Region = {
  id: number;
  name: string;
};

type Province = {
  id: number;
  name: string;
};

type Locality = {
  id: number;
  name: string;
  locality_type: "CITY" | "MUNICIPALITY" | "DISTRICT";
  province_id: number;
};

type DisplayShop = {
  id: number;
  name: string;
  description: string;
  image?: string | null;
  localityName?: string | null;
  provinceName?: string | null;
  averageRating?: number | null;
  priceLevel?: string | null;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const testimonials: Testimonial[] = [
  {
    id: 1,
    title: "“The sisig here hits differently!”",
    text: "Found this eatery by accident while walking in Angeles — crispy, tangy, and perfectly spiced. The locals weren’t kidding when they said it’s a must-try!",
    name: "Carla M.",
    location: "Angeles City",
  },
  {
    id: 2,
    title: "“Affordable and super flavorful!”",
    text: "Banh Mi is my go-to for lunch now. Bread’s always fresh, and the pork filling reminds me of street food in Vietnam.",
    name: "James L.",
    location: "San Fernando, Pampanga",
  },
  {
    id: 3,
    title: "“Hidden gem indeed!”",
    text: "Tried this small karinderya in Mabalacat — cozy, friendly owner, and the adobo flakes were on point. Prices are student-friendly too!",
    name: "Mia S.",
    location: "Mabalacat City",
  },
  {
    id: 4,
    title: "“Parang lutong bahay ni nanay”",
    text: "Yung sinigang dito sakto yung asim, tapos super daming gulay. Perfect after a long day sa office.",
    name: "Mark D.",
    location: "Quezon City",
  },
  {
    id: 5,
    title: "“Sulit sa barkada”",
    text: "Nakahanap kami ng tapsilogan na open till late — malaking serving, but friendly sa wallet. Solid after-gimikan spot.",
    name: "Rhea T.",
    location: "Makati",
  },
  {
    id: 6,
    title: "“Legit student-budget friendly”",
    text: "Everyday ulam for less than 100 pesos pero hindi tipid sa ulam. Sobrang lifesaver sa allowance ko.",
    name: "Jonas P.",
    location: "Taft, Manila",
  },
  {
    id: 7,
    title: "“Comfort food sa tabi-tabi”",
    text: "Yung lugaw sa kanto na ’to may free tokwa promo pa minsan. Perfect pang-umaga bago duty.",
    name: "Nurse Anne",
    location: "Caloocan",
  },
  {
    id: 8,
    title: "“The Best Iced Coffee in Town!”",
    text: "I was looking for a quick caffeine fix and stumbled upon this tiny stall. Their strong brew and sweet cream are the perfect combo to start my day.",
    name: "Don David",
    location: "BGC, Taguig",
  },
  {
    id: 9,
    title: "“Lomi na nagpapawi ng pagod”",
    text: "Grabe yung sahog! Kaya pala dinadayo. Isang bowl lang, busog na busog na at nakakawala ng stress sa biyahe.",
    name: "Mark Santos",
    location: "Lipa, Batangas",
  },
  {
    id: 10,
    title: "“Dessert Cravings Solved”",
    text: "Their Halo-Halo is incredible—creamy milk, lots of sweet toppings, and the ice is finely shaved. It's the perfect summer treat.",
    name: "Andreas Luy",
    location: "Cebu City",
  },
  {
    id: 11,
    title: "“Authentic Bicol Express!”",
    text: "Finally, a place that knows how to balance the spice and coconut milk. It has that genuine kick I’ve been looking for. Definitely coming back!",
    name: "Kenneth Amurao",
    location: "Legazpi, Albay",
  },
  {
    id: 12,
    title: "“Worth the Drive!”",
    text: "We drove out of the city just to try their bulalo, and it was absolutely worth it! Tender meat and rich, hot broth. Perfect for the cool Tagaytay weather.",
    name: "Raemart Millare",
    location: "Tagaytay City",
  },
  {
    id: 13,
    title: "“The best pancit I've ever had.”",
    text: "I ordered their Pancit Malabon for a small gathering, and everyone loved it. Generous toppings and the sauce was savory and thick.",
    name: "Carlex Lazaga",
    location: "Malabon City",
  },
  {
    id: 14,
    title: "“A taste of Ilocos here in Manila.”",
    text: "The Vigan Longganisa they use for their silog meals is legit. Garlic, savory, and tangy—just the way it should be. Great breakfast spot.",
    name: "Kyle Salvador",
    location: "Sampaloc, Manila",
  },
  {
    id: 15,
    title: "“Budget-friendly comfort food!”",
    text: "Hindi ka magsisisi sa order mo. Yung Chicken Inasal nila malaki, flavorful, at mura pa. Solid dinner choice after school.",
    name: "Bien Tubil",
    location: "Iloilo City",
  },
];

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const TestimonialsMarquee: React.FC = () => {
  const items = [...testimonials, ...testimonials];

  return (
<div className="relative mt-10 overflow-hidden py-8 md:py-10">
      <div className="flex w-max gap-6 testimonial-marquee">
        {items.map((t, index) => (
          <motion.article
            key={`${t.id}-${index}`}
            className="flex min-w-[260px] max-w-xs flex-col rounded-xl border border-[#f47a44] bg-white px-5 py-4 text-sm shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <p className="font-semibold text-[#f47a44]">{t.title}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#444]">
              {t.text}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 text-xs font-semibold text-[#333]">
                {getInitials(t.name)}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-[#f47a44]">
                  {t.name}
                </div>
                <div className="text-[11px] text-[#555]">{t.location}</div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

// helper that supports { data: [...] } or [...]
const unwrapCollection = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const obj = payload as { data?: unknown };
    return Array.isArray(obj.data) ? (obj.data as T[]) : [];
  }
  return [];
};

const formatPriceLevel = (level?: string | null): string => {
  if (!level) return "";
  switch (level) {
    case "budget":
      return "₱ Budget-friendly";
    case "mid":
      return "₱₱ Mid-range";
    case "premium":
      return "₱₱₱ Premium";
    default:
      return level;
  }
};

const formatRating = (rating?: number | null): string => {
  if (rating === null || rating === undefined) return "No rating yet";
  return `${rating.toFixed(1)} · Rated`;
};

const LandingPage: React.FC = () => {
  // static fallback cards (used if API fails)
  const defaultShops: DisplayShop[] = [
    {
      id: 1,
      name: "Shop #1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quam purus, iaculis vel tortor ac, imperdiet blandit erat.",
      image: "/images/banhmi.jpg",
    },
    {
      id: 2,
      name: "Shop #2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quam purus, iaculis vel tortor ac, imperdiet blandit erat. Quisque id lobortis turpis.",
      image: "/images/annie-bea-eatery.jpg",
    },
    {
      id: 3,
      name: "Shop #3",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam quam purus, iaculis vel tortor ac, imperdiet blandit erat. Quisque id lobortis turpis.",
      image: "/images/shop-interior.jpg",
    },
  ];

  // filters
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);

  const [selectedRegionId, setSelectedRegionId] = useState<number | "">("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | "">("");
  const [selectedLocalityId, setSelectedLocalityId] = useState<number | "">("");

  // shops
  const [initialShops, setInitialShops] = useState<DisplayShop[] | null>(null);
  const [shopsFromApi, setShopsFromApi] = useState<DisplayShop[] | null>(null);

  // loading flags
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  const [isLoadingInitialShops, setIsLoadingInitialShops] = useState(false);
  const [isLoadingShops, setIsLoadingShops] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasSelectedLocality = !!selectedLocalityId;

  const baseCards: DisplayShop[] =
    initialShops && initialShops.length > 0 ? initialShops : defaultShops;

  const cardsToRender: DisplayShop[] = hasSelectedLocality
    ? shopsFromApi || []
    : baseCards;

  // load regions
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setIsLoadingRegions(true);
        setErrorMessage(null);

        const res = await fetch(`${API_BASE}/regions`);
        if (!res.ok) throw new Error("Failed to load regions");
        const data = await res.json();
        setRegions(unwrapCollection<Region>(data));
      } catch (err) {
        console.error(err);
        setErrorMessage("Unable to load regions for now.");
      } finally {
        setIsLoadingRegions(false);
      }
    };

    loadRegions();
  }, []);

  // load initial shops
  useEffect(() => {
    const loadInitialShops = async () => {
      try {
        setIsLoadingInitialShops(true);
        const res = await fetch(`${API_BASE}/shops`);
        if (!res.ok) throw new Error("Failed to load initial shops");
        const data = await res.json();
        const raw = unwrapCollection<any>(data);
        const mapped: DisplayShop[] = raw.map((shop) => ({
          id: shop.id,
          name: shop.name,
          description:
            shop.short_description ??
            shop.long_description ??
            "No short description yet. This spot is waiting for its first full story.",
          image:
            shop.cover_image_url ??
            (shop.photos && shop.photos[0] ? shop.photos[0].url : null),
          localityName: shop.locality?.name ?? null,
          provinceName: shop.province?.name ?? null,
          averageRating: shop.average_rating ?? null,
          priceLevel: shop.price_level ?? null,
        }));
        setInitialShops(mapped.slice(0, 3));
      } catch (err) {
        console.error("Failed to load initial shops:", err);
        setInitialShops(null);
      } finally {
        setIsLoadingInitialShops(false);
      }
    };

    loadInitialShops();
  }, []);

  // when region changes, load provinces via /regions/{id}/provinces
  useEffect(() => {
    if (!selectedRegionId) {
      setProvinces([]);
      setLocalities([]);
      setSelectedProvinceId("");
      setSelectedLocalityId("");
      setShopsFromApi(null);
      return;
    }

    const loadProvinces = async () => {
      try {
        setIsLoadingProvinces(true);
        setErrorMessage(null);
        const res = await fetch(
          `${API_BASE}/regions/${selectedRegionId}/provinces`
        );
        if (!res.ok) throw new Error("Failed to load provinces");
        const data = await res.json();
        setProvinces(unwrapCollection<Province>(data));
        setLocalities([]);
        setSelectedProvinceId("");
        setSelectedLocalityId("");
        setShopsFromApi(null);
      } catch (err) {
        console.error(err);
        setErrorMessage("Unable to load provinces for now.");
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [selectedRegionId]);

  // when province changes, load localities via /provinces/{id}/localities
  useEffect(() => {
    if (!selectedProvinceId) {
      setLocalities([]);
      setSelectedLocalityId("");
      setShopsFromApi(null);
      return;
    }

    const loadLocalities = async () => {
      try {
        setIsLoadingLocalities(true);
        setErrorMessage(null);
        const res = await fetch(
          `${API_BASE}/provinces/${selectedProvinceId}/localities`
        );
        if (!res.ok) throw new Error("Failed to load localities");
        const data = await res.json();
        setLocalities(unwrapCollection<Locality>(data));
        setSelectedLocalityId("");
        setShopsFromApi(null);
      } catch (err) {
        console.error(err);
        setErrorMessage("Unable to load cities/municipalities for now.");
      } finally {
        setIsLoadingLocalities(false);
      }
    };

    loadLocalities();
  }, [selectedProvinceId]);

  // when locality changes, load shops via ?locality_id=
  useEffect(() => {
    if (!selectedLocalityId) {
      setShopsFromApi(null);
      return;
    }

    const loadShops = async () => {
      try {
        setIsLoadingShops(true);
        setErrorMessage(null);
        const res = await fetch(
          `${API_BASE}/shops?locality_id=${selectedLocalityId}`
        );
        if (!res.ok) throw new Error("Failed to load shops");
        const data = await res.json();
        const raw = unwrapCollection<any>(data);
        const mapped: DisplayShop[] = raw.map((shop) => ({
          id: shop.id,
          name: shop.name,
          description:
            shop.short_description ??
            shop.long_description ??
            "No short description yet. This spot is waiting for its first full story.",
          image:
            shop.cover_image_url ??
            (shop.photos && shop.photos[0] ? shop.photos[0].url : null),
          localityName: shop.locality?.name ?? null,
          provinceName: shop.province?.name ?? null,
          averageRating: shop.average_rating ?? null,
          priceLevel: shop.price_level ?? null,
        }));
        setShopsFromApi(mapped);
      } catch (err) {
        console.error(err);
        setErrorMessage("Unable to load hidden gems for this area.");
        setShopsFromApi([]);
      } finally {
        setIsLoadingShops(false);
      }
    };

    loadShops();
  }, [selectedLocalityId]);

  return (
    <div className="min-h-screen bg-white text-white">
      <Navbar />

      <main className="mt-16">
        {/* HERO – combined version (yours + modern copy) */}
        <section
          id="home"
          // Changed to solid light orange color
          className="bg-orange-50 text-[#1e1e1e]" 
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8 md:flex-row md:items-center md:pb-20 md:pt-10">
            {/* Left: content */}
            <motion.div
              className="flex-1 space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-3 py-1 text-[11px] font-semibold text-orange-700 shadow-sm">
                🍲 Saan mo gusto kumain? Sagot ko na
              </span>

              <h1 className="text-3xl font-extrabold leading-tight md:text-4xl lg:text-[2.6rem]">
                Discover everyday{" "}
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  ulam gems
                </span>{" "}
                near you.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#555] md:text-[15px]">
                Ulam helps you find budget-friendly carinderias, tapsilogs, and
                neighborhood favorites — all recommended by locals, not ads.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href="#discover"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f47a44] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(249,115,22,0.60)] hover:bg-[#e56730] transition"
                >
                  Start discovering
                </a>
                <Link
                  to="/gems/new"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white/90 px-4 py-2 text-xs font-medium text-orange-700 hover:bg-orange-50"
                >
                  Post a hidden gem
                </Link>
              </div>

              <div className="mt-4 grid gap-4 text-xs text-[#555] md:grid-cols-3">
                <div>
                  <p className="font-semibold text-[#333]">Community-curated</p>
                  <p className="mt-1">
                    Real stories from real people — no sponsored placements.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#333]">Budget-aware</p>
                  <p className="mt-1">
                    Quickly see if a spot is budget, mid-range, or pang–treat
                    yourself.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#333]">Local-first</p>
                  <p className="mt-1">
                    Focused on everyday eats near schools, offices, and barangays.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: sample card */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            >
              <div className="relative mx-auto max-w-md rounded-3xl bg-white/80 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                <div className="overflow-hidden rounded-2xl bg-gray-200">
                  <img
                    src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwle7IZRSInnaWW2kAmuMeFI9GQC6Q6BS9otKn55S1MvoPUcJinvvaiDLcAUEuErF5GgLBXGA56jIUgxCj5NmO2KEabUUYOXfpCrE_DsOtjVsSo7PZJkZdKmEg0SU1x5pqybPmJwEIW-3QR=s680-w680-h510-rw"
                    alt="Sample hidden gem"
                    className="h-52 w-full object-cover"
                  />
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#1e1e1e]">
                      Yurikang Tapsilogan
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      ★ 4.5
                    </span>
                  </div>
                  <p className="flex items-center gap-1 text-[11px] text-gray-500">
                    <span>📍</span> Angeles City • Pampanga
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#555]">
                    Crispy sisig, lutong-bahay ulam, and unlimited sabaw —
                    favorite ng mga students and workers sa area.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium text-gray-700">
                      💸 Budget-friendly
                    </span>
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-[10px] font-medium text-orange-700">
                      🧂 Sisig • Silog • Sabaw
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS (yours, kept) */}
        <section
          aria-labelledby="how-it-works"
          className="bg-white py-14 md:py-20"
        >
          <AnimatedSection className="mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row md:items-start">
            <AnimatedSection className="md:w-1/2" direction="left">
              <h2
                id="how-it-works"
                className="text-2xl font-extrabold text-[#f47a44] md:text-[1.9rem]"
              >
                How it works
              </h2>
              <p className="mt-3 text-sm font-medium text-[#333] md:text-base">
                Three quick steps to find and share your local food treasures.
              </p>

              <ol className="mt-6 space-y-5 text-sm leading-relaxed md:text-base">
                <li className="text-[#333]">
                  <span className="font-semibold">1. Pick your area — </span>
                  Select your Region, Province, and Locality to start browsing
                  nearby spots.
                </li>
                <li className="text-[#333]">
                  <span className="font-semibold">
                    2. Discover hidden gems —{" "}
                  </span>
                  Read reviews, check photos, and find local favorites worth
                  visiting.
                </li>
                <li className="text-[#333]">
                  <span className="font-semibold" >
                    3. Share your experience —{" "}
                  </span>
                  Like, comment, and post your own food discoveries.
                </li>
              </ol>

              <p className="mt-6 text-sm text-[#444] md:text-base">
                Ulam helps you explore by location—start broad, then zoom in to
                your favorite spots.
              </p>
            </AnimatedSection>

            <AnimatedSection
              className="flex flex-1 items-center justify-center md:w-1/2"
              direction="right"
            >
              <img
                src={HowItWorksImg}
                alt="Flow: Pick Region, Pick Province, Pick Locality"
                className="w-full max-w-sm"
              />
            </AnimatedSection>
          </AnimatedSection>
        </section>

        {/* BROWSE HIDDEN GEMS – keep layout, add a bit more copy */}
        <section
          id="discover"
          aria-labelledby="browse-gems"
          className="bg-white py-16 md:py-20"
        >
          <AnimatedSection className="mx-auto max-w-6xl px-6">
            <h2
              id="browse-gems"
              className="text-2xl font-extrabold text-[#f47a44] md:text-[1.9rem]"
            >
              Browse Hidden Gems
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#555] md:text-[15px]">
              Start by choosing where you are. Ulam will filter community-posted
              spots based on your region, province, and locality so you only see
              places that are actually near you.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Tip: Try selecting your school, work area, or hometown to see what
              locals recommend around you.
            </p>

            {/* Filters (unchanged structurally) */}
            <AnimatedSection className="mt-6 flex flex-wrap items-center gap-6 text-sm">
              {/* Region */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#333]">
                  Region
                </span>
                <div className="relative">
                  <select
                    className="h-10 w-48 rounded-full border border-gray-300 bg-white px-4 pr-9 text-sm text-gray-800 shadow-[0_2px_6px_rgba(0,0,0,0.04)] focus:border-[#f47a44] focus:outline-none"
                    value={selectedRegionId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedRegionId(value ? Number(value) : "");
                    }}
                  >
                    <option value="">
                      {isLoadingRegions ? "Loading..." : "Select"}
                    </option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Provinces */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#333]">
                  Provinces
                </span>
                <div className="relative">
                  <select
                    className="h-10 w-48 rounded-full border border-gray-300 bg-white px-4 pr-9 text-sm text-gray-800 shadow-[0_2px_6px_rgba(0,0,0,0.04)] focus:border-[#f47a44] focus:outline-none"
                    value={selectedProvinceId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedProvinceId(value ? Number(value) : "");
                    }}
                    disabled={!selectedRegionId || isLoadingProvinces}
                  >
                    <option value="">
                      {!selectedRegionId
                        ? "Select region first"
                        : isLoadingProvinces
                        ? "Loading..."
                        : "Select"}
                    </option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Localities */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[#333]">
                  Localities
                </span>
                <div className="relative">
                  <select
                    className="h-10 w-48 rounded-full border border-gray-300 bg-white px-4 pr-9 text-sm text-gray-800 shadow-[0_2px_6px_rgba(0,0,0,0.04)] focus:border-[#f47a44] focus:outline-none"
                    value={selectedLocalityId}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedLocalityId(value ? Number(value) : "");
                    }}
                    disabled={!selectedProvinceId || isLoadingLocalities}
                  >
                    <option value="">
                      {!selectedProvinceId
                        ? "Select province first"
                        : isLoadingLocalities
                        ? "Loading..."
                        : "Select"}
                    </option>
                    {localities.map((locality) => (
                      <option key={locality.id} value={locality.id}>
                        {locality.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </AnimatedSection>

            {/* Tiny status messages */}
            {errorMessage && (
              <p className="mt-3 text-xs text-red-500">{errorMessage}</p>
            )}

            {isLoadingInitialShops && !hasSelectedLocality && (
              <p className="mt-3 text-xs text-gray-500">
                Loading featured hidden gems…
              </p>
            )}

            {isLoadingShops && hasSelectedLocality && (
              <p className="mt-3 text-xs text-gray-500">
                Loading hidden gems for this area…
              </p>
            )}

            {!isLoadingShops &&
              hasSelectedLocality &&
              shopsFromApi &&
              shopsFromApi.length === 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  No submitted gems yet for this locality — be the first to
                  share one!
                </p>
              )}

            {/* Cards */}
            {cardsToRender.length > 0 && (
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {cardsToRender.map((shop, index) => {
                  const isFromApi =
                    hasSelectedLocality ||
                    (initialShops !== null && !hasSelectedLocality);

                  const locationLabel =
                    shop.localityName && shop.provinceName
                      ? `${shop.localityName}, ${shop.provinceName}`
                      : shop.localityName || shop.provinceName || "";

                  const priceLabel = formatPriceLevel(shop.priceLevel);
                  const ratingLabel = formatRating(shop.averageRating);

                  const card = (
                    <motion.article
                      className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.14)] transition"
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                    >
                      <div className="h-56 w-full bg-gray-200">
                        {shop.image && (
                          <img
                            src={shop.image}
                            alt={shop.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col px-4 pb-5 pt-3 text-sm">
                        <h3 className="font-semibold text-[#1e1e1e]">
                          {shop.name}
                        </h3>

                        {(locationLabel || shop.averageRating) && (
                          <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#777]">
                            {locationLabel && (
                              <span className="inline-flex items-center gap-1">
                                <span>{locationLabel}</span>
                              </span>
                            )}
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-[2px] text-[10px] text-[#555]">
                              {shop.averageRating
                                ? `⭐ ${ratingLabel}`
                                : "No rating yet"}
                            </span>
                          </div>
                        )}

                        {priceLabel && (
                          <div className="mt-2">
                            <span className="inline-flex items-center rounded-full bg-[#fff3ea] px-2.5 py-[3px] text-[11px] font-medium text-[#f47a44]">
                              {priceLabel}
                            </span>
                          </div>
                        )}

                        <p className="mt-3 text-[13px] leading-relaxed text-[#555] line-clamp-3">
                          {shop.description}
                        </p>
                      </div>
                    </motion.article>
                  );

                  return (
                    <AnimatedSection key={shop.id} delay={0.08 * index}>
                      {isFromApi ? (
                        <Link to={`/gems/${shop.id}`} className="block h-full">
                          {card}
                        </Link>
                      ) : (
                        card
                      )}
                    </AnimatedSection>
                  );
                })}

                {/* Add-your-own card */}
                <AnimatedSection delay={0.24}>
                  <Link to="/gems/new" className="block h-full">
                    <motion.article
                      className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#f47a44]/60 bg-[#ffe5d7] px-5 py-6 text-center text-sm font-semibold text-[#f47a44]"
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                      }}
                    >
                      <div>
                        Add your own hidden gem
                        <br />
                        <span className="text-xs font-normal">
                          Share a spot you love in your area.
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                </AnimatedSection>
              </div>
            )}
          </AnimatedSection>
        </section>

        {/* TESTIMONIALS + CTA – kept, with more padding in marquee */}
        <section id="post" className="bg-white py-16 md:py-20">
          <AnimatedSection className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-extrabold text-[#f47a44] md:text-[1.9rem]">
              What Locals Are Saying
            </h2>
            <p className="mt-2 text-sm font-medium text-[#333] md:text-base">
              Real stories from the Ulammunity — fresh from our hidden gems.
            </p>

            <TestimonialsMarquee />

            <AnimatedSection className="mt-12 rounded-2xl bg-[#f47a44] px-8 py-10 text-white md:px-12 md:py-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-3">
                  <h3 className="text-2xl font-extrabold md:text-3xl">
                    Ready to share your own hidden gem?
                  </h3>
                  <p className="text-sm leading-relaxed md:text-base text-orange-50">
                    Join the Ulammunity and help others discover the best local
                    eats around you. Post your favorite spots, add photos, and
                    leave honest reviews that other food lovers can trust.
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                  <Link
                    to="/gems/new"
                    className="rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-[#f47a44] shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:bg-orange-50 transition"
                  >
                    Post a hidden gem
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
