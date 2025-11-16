import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";

type Region = {
  id: number;
  name: string;
};

type Province = {
  id: number;
  name: string;
  region_id: number;
};

type Locality = {
  id: number;
  name: string;
  province_id: number;
};

type ShopLocation = {
  name: string;
};

type Shop = {
  id: number;
  name: string;
  short_description: string | null;
  long_description?: string | null;
  address_text: string | null;
  cover_image_url: string | null;
  locality?: ShopLocation | null;
  province?: ShopLocation | null;
  region?: ShopLocation | null;
  avg_cost_hint?: string | null;
  average_rating?: number | null;
  rating_count?: number;
};

type PaginationMeta = {
  current_page: number;
  last_page: number;
  total: number;
} | null;

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// helper that supports { data: [...] } or [...]
const unwrapCollection = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const p = payload as { data?: unknown };
    return Array.isArray(p.data) ? (p.data as T[]) : [];
  }
  return [];
};

const DiscoverPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);

  const [selectedRegionId, setSelectedRegionId] = useState<number | "">("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | "">("");
  const [selectedLocalityId, setSelectedLocalityId] = useState<number | "">("");
  const [priceLevel, setPriceLevel] = useState<string>("");

  // searchInput = text in the box, searchQuery = actual filter sent to API
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [shops, setShops] = useState<Shop[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(null);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hasAnyFilter = useMemo(
    () =>
      Boolean(
        searchQuery ||
          selectedRegionId ||
          selectedProvinceId ||
          selectedLocalityId ||
          priceLevel
      ),
    [searchQuery, selectedRegionId, selectedProvinceId, selectedLocalityId, priceLevel]
  );

  // 🔁 Load regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch(`${API_BASE}/regions`);
        if (!res.ok) throw new Error("Failed to load regions");
        const data = await res.json();
        setRegions(unwrapCollection<Region>(data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegions();
  }, []);

  // 🔁 Load provinces when region changes
  useEffect(() => {
    if (!selectedRegionId) {
      setProvinces([]);
      setSelectedProvinceId("");
      setLocalities([]);
      setSelectedLocalityId("");
      return;
    }

    const fetchProvinces = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/regions/${selectedRegionId}/provinces`
        );
        if (!res.ok) throw new Error("Failed to load provinces");
        const data = await res.json();
        setProvinces(unwrapCollection<Province>(data));
        setSelectedProvinceId("");
        setLocalities([]);
        setSelectedLocalityId("");
      } catch (err) {
        console.error(err);
      }
    };

    fetchProvinces();
  }, [selectedRegionId]);

  // 🔁 Load localities when province changes
  useEffect(() => {
    if (!selectedProvinceId) {
      setLocalities([]);
      setSelectedLocalityId("");
      return;
    }

    const fetchLocalities = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/provinces/${selectedProvinceId}/localities`
        );
        if (!res.ok) throw new Error("Failed to load localities");
        const data = await res.json();
        setLocalities(unwrapCollection<Locality>(data));
        setSelectedLocalityId("");
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocalities();
  }, [selectedProvinceId]);

  // 🍲 Load shops whenever filters / page change
  useEffect(() => {
    const fetchShops = async () => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedRegionId) params.append("region_id", String(selectedRegionId));
      if (selectedProvinceId)
        params.append("province_id", String(selectedProvinceId));
      if (selectedLocalityId)
        params.append("locality_id", String(selectedLocalityId));
      if (priceLevel) params.append("price_level", priceLevel);

      params.append("page", String(page));
      params.append("per_page", "8");

      try {
        const res = await fetch(`${API_BASE}/shops?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load hidden gems");

        const payload = await res.json();
        const items = unwrapCollection<Shop>(payload);

        const meta =
          payload &&
          typeof payload === "object" &&
          "meta" in payload &&
          payload.meta &&
          typeof payload.meta === "object"
            ? (payload.meta as PaginationMeta)
            : null;

        setShops(items);
        setPagination(meta);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading hidden gems.");
        setShops([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    };

    fetchShops();
  }, [
    searchQuery,
    selectedRegionId,
    selectedProvinceId,
    selectedLocalityId,
    priceLevel,
    page,
  ]);

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedRegionId("");
    setSelectedProvinceId("");
    setSelectedLocalityId("");
    setPriceLevel("");
    setPage(1);
  };

  const handleSearchKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }
  };

  const currentPage = pagination?.current_page ?? 1;
  const lastPage = pagination?.last_page ?? 1;
  const totalResults = pagination?.total ?? shops.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header is rendered globally */}

      <main className="pt-16 md:pt-19 flex-1 bg-white">
        {/* 🧡 Top strip / heading */}
        <section className="border-b border-orange-100 bg-orange-50">
          <AnimatedSection className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500 mb-2">
              Discover · Community picks
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Discover hidden gems near you
            </h1>
            <p className="mt-2 text-sm md:text-[15px] text-slate-600 max-w-2xl">
              Ulam helps you find budget-friendly carinderias, tapsilogs, and
              neighborhood favorites recommended by locals — not ads.
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl">
              Filter by region, province, locality, and price level to explore
              everyday ulam spots that match your budget and location.
            </p>
          </AnimatedSection>
        </section>

        {/* 🔍 Filters + results area */}
        <section className="bg-white">
          <AnimatedSection
            className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-8"
            direction="up"
            delay={0.05}
          >
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a dish, spot, or keyword…"
                  className="w-full rounded-full border border-orange-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Press Enter to search
                </span>
              </div>
              {searchQuery && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Showing results for{" "}
                  <span className="font-semibold">&ldquo;{searchQuery}&rdquo;</span>
                </p>
              )}
            </div>

            {/* Filters row */}
            <AnimatedSection
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
              direction="up"
              delay={0.1}
            >
              {/* Region */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Region
                </label>
                <select
                  className="w-full rounded-full border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={selectedRegionId}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : "";
                    setSelectedRegionId(value);
                    setPage(1);
                  }}
                >
                  <option value="">Anywhere</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Province */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Provinces
                </label>
                <select
                  className="w-full rounded-full border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={selectedProvinceId}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : "";
                    setSelectedProvinceId(value);
                    setPage(1);
                  }}
                  disabled={!selectedRegionId}
                >
                  <option value="">
                    {selectedRegionId ? "Any province" : "Select region first"}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Locality */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Localities
                </label>
                <select
                  className="w-full rounded-full border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={selectedLocalityId}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : "";
                    setSelectedLocalityId(value);
                    setPage(1);
                  }}
                  disabled={!selectedProvinceId}
                >
                  <option value="">
                    {selectedProvinceId ? "Any locality" : "Select province first"}
                  </option>
                  {localities.map((locality) => (
                    <option key={locality.id} value={locality.id}>
                      {locality.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Price level
                </label>
                <select
                  className="w-full rounded-full border border-orange-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={priceLevel}
                  onChange={(e) => {
                    setPriceLevel(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Any price</option>
                  <option value="budget">Budget-friendly</option>
                  <option value="mid">Mid-range</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </AnimatedSection>

            {/* Status row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
              <p className="text-xs text-slate-500">
                {isInitialLoading
                  ? "Loading hidden gems near you…"
                  : `Showing ${totalResults} hidden gem${
                      totalResults === 1 ? "" : "s"
                    }`}
              </p>

              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center self-start rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 transition"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Cards grid */}
            {error && (
              <AnimatedSection
                className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                direction="up"
                delay={0.05}
              >
                {error}
              </AnimatedSection>
            )}

            <AnimatedSection
              className="grid gap-6 md:grid-cols-2"
              direction="up"
              delay={0.15}
            >
              {/* Actual shops */}
              {shops.map((shop) => (
                <Link
                  key={shop.id}
                  to={`/gems/${shop.id}`}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow border border-orange-50"
                >
                  <div className="h-52 w-full overflow-hidden bg-slate-100">
                    {shop.cover_image_url ? (
                      <img
                        src={shop.cover_image_url}
                        alt={shop.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        No photo yet
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                      {shop.name}
                    </h2>
                    <p className="text-xs text-slate-500 mb-2">
                      {[
                        shop.locality?.name,
                        shop.province?.name,
                        shop.region?.name,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>

                    {(shop.short_description || shop.long_description) && (
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {shop.short_description ||
                          shop.long_description ||
                          ""}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-wrap gap-2">
                        {shop.avg_cost_hint && (
                          <span className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-medium text-orange-700">
                            {shop.avg_cost_hint === "budget"
                              ? "Budget-friendly"
                              : shop.avg_cost_hint === "mid"
                              ? "Mid-range"
                              : "Premium"}
                          </span>
                        )}
                      </div>

                      {shop.average_rating && shop.rating_count ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          ⭐
                          <span className="font-semibold text-slate-800">
                            {shop.average_rating.toFixed(1)}
                          </span>
                          <span>({shop.rating_count})</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          No rating yet
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}

              {/* “Add your own hidden gem” card */}
              <Link
                to="/gems/new"
                className="flex items-center justify-center rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/60 p-6 text-center text-sm text-orange-700 hover:bg-orange-50 transition"
              >
                <div>
                  <p className="font-semibold mb-1">Add your own hidden gem</p>
                  <p className="text-xs text-orange-600">
                    Share a spot you love in your area so others can discover it
                    too.
                  </p>
                </div>
              </Link>
            </AnimatedSection>

            {/* Pagination (only if backend returns meta) */}
            {pagination && lastPage > 1 && (
              <AnimatedSection
                className="mt-8 flex items-center justify-center gap-3"
                direction="up"
                delay={0.1}
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-50 transition"
                >
                  Previous
                </button>

                <span className="text-xs text-slate-500">
                  Page {currentPage} of {lastPage}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={currentPage === lastPage || isLoading}
                  className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-50 transition"
                >
                  Next
                </button>
              </AnimatedSection>
            )}

            {isLoading && (
              <p className="mt-4 text-xs text-slate-400">
                Loading fresh recommendations…
              </p>
            )}
          </AnimatedSection>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DiscoverPage;
