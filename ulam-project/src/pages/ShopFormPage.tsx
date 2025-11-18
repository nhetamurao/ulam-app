import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "/api";

// ---- types ----
type Region = { id: number; name: string };
type Province = { id: number; name: string; region_id: number };
type Locality = {
  id: number;
  name: string;
  province_id: number;
  locality_type: "CITY" | "MUNICIPALITY" | "DISTRICT";
};

type ShopDetail = {
  id: number;
  name: string;
  short_description: string | null;
  long_description: string | null;
  address_text: string | null;
  avg_cost_hint: "budget" | "mid" | "premium";
  cover_image_url: string | null;
  locality?: { id: number; name: string } | null;
  province?: { id: number; name: string } | null;
  region?: { id: number; name: string } | null;
};

const unwrapCollection = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const p = payload as { data?: unknown };
    return Array.isArray(p.data) ? (p.data as T[]) : [];
  }
  return [];
};

const ShopFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // ---- dropdown data ----
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);

  const [selectedRegionId, setSelectedRegionId] = useState<number | "">("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | "">("");
  const [selectedLocalityId, setSelectedLocalityId] = useState<number | "">("");

  // ---- form fields ----
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [addressText, setAddressText] = useState("");
  const [avgCostHint, setAvgCostHint] = useState<"budget" | "mid" | "premium">(
    "budget"
  );
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // ---- form states ----
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const hasLocationSelected =
    !!selectedRegionId && !!selectedProvinceId && !!selectedLocalityId;

  // ---- Load region/province/locality dropdowns ----
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const res = await fetch(`${API_BASE}/regions`);
        if (!res.ok) throw new Error("Failed to load regions");
        setRegions(unwrapCollection<Region>(await res.json()));
      } catch (err) {
        console.error(err);
      }
    };
    loadRegions();
  }, []);

  useEffect(() => {
    if (!selectedRegionId) {
      setProvinces([]);
      setLocalities([]);
      setSelectedProvinceId("");
      setSelectedLocalityId("");
      return;
    }

    const loadProvinces = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/provinces?region_id=${selectedRegionId}`
        );
        if (!res.ok) throw new Error("Failed to load provinces");
        setProvinces(unwrapCollection<Province>(await res.json()));
      } catch (err) {
        console.error(err);
      }
    };
    loadProvinces();
  }, [selectedRegionId]);

  useEffect(() => {
    if (!selectedProvinceId) {
      setLocalities([]);
      setSelectedLocalityId("");
      return;
    }

    const loadLocalities = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/localities?province_id=${selectedProvinceId}`
        );
        if (!res.ok) throw new Error("Failed to load localities");
        setLocalities(unwrapCollection<Locality>(await res.json()));
      } catch (err) {
        console.error(err);
      }
    };
    loadLocalities();
  }, [selectedProvinceId]);

  // ---- Load shop when editing ----
  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadShop = async () => {
      try {
        setIsLoadingForm(true);
        const res = await fetch(`${API_BASE}/shops/${id}`);
        if (!res.ok) throw new Error("Failed to load shop");
        const data = await res.json();
        const payload: ShopDetail = "data" in data ? data.data : data;

        setName(payload.name || "");
        setShortDescription(payload.short_description || "");
        setLongDescription(payload.long_description || "");
        setAddressText(payload.address_text || "");
        setAvgCostHint(payload.avg_cost_hint || "budget");
        setCoverImageUrl(payload.cover_image_url || "");

        if (payload.region) setSelectedRegionId(payload.region.id);
        if (payload.province) setSelectedProvinceId(payload.province.id);
        if (payload.locality) setSelectedLocalityId(payload.locality.id);
      } catch (err) {
        console.error(err);
        setFormError("Unable to load this hidden gem for editing.");
      } finally {
        setIsLoadingForm(false);
      }
    };

    loadShop();
  }, [isEditMode, id]);

  // ---- Submit form ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!token) {
      navigate("/login");
      return;
    }

    if (!name.trim()) return setFormError("Please give the place a name.");
    if (!hasLocationSelected)
      return setFormError("Please complete the location selection.");

    try {
      setIsSubmitting(true);

      const payload = {
        name: name.trim(),
        short_description: shortDescription.trim(),
        long_description: longDescription.trim() || null,
        address_text: addressText.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        locality_id: selectedLocalityId,
        is_published: 1,
      };

      const url = isEditMode
        ? `${API_BASE}/shops/${id}`
        : `${API_BASE}/shops`;

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      const saved = "data" in data ? data.data : data;

      setFormSuccess(isEditMode ? "Saved!" : "Created!");

      if (saved?.id) {
        setTimeout(() => navigate(`/gems/${saved.id}`), 600);
      }
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Delete ----
  const handleDelete = async () => {
    if (!isEditMode || !id) return;

    if (
      !window.confirm(
        "Delete this hidden gem? This action cannot be undone."
      )
    )
      return;

    try {
      await fetch(`${API_BASE}/shops/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setFormError("Unable to delete this hidden gem.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1e1e1e]">
      <main className="pt-20 md:pt-24 flex-1">
        {/* PAGE CONTAINER */}
        <AnimatedSection className="mx-auto max-w-3xl px-6 pb-16">
          {/* HEADING ANIMATION */}
          <AnimatedSection direction="up" className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#f47a44] hover:underline"
            >
              Back
            </button>

            <h1 className="text-2xl md:text-3xl font-extrabold">
              {isEditMode ? "Edit hidden gem" : "Post a hidden gem"}
            </h1>

            <p className="mt-2 text-sm text-[#555]">
              Share something delicious with the Ulammunity.
            </p>

            {user && (
              <p className="mt-1 text-xs text-[#888]">
                Posting as <span className="font-semibold">{user.name}</span>
              </p>
            )}
          </AnimatedSection>

          {/* FORM CARD */}
          <AnimatedSection
            direction="up"
            delay={0.1}
            className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
          >
            {isLoadingForm ? (
              <p className="text-sm text-gray-500">Loading…</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error / Success */}
                {formError && (
                  <p className="text-sm text-red-500">{formError}</p>
                )}
                {formSuccess && (
                  <p className="text-sm text-green-600">{formSuccess}</p>
                )}

                {/* NAME */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    placeholder="e.g. Ate Nena's Lugawan"
                  />
                </div>

                {/* LOCATION */}
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Region */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Region *</label>
                    <select
                      value={selectedRegionId}
                      onChange={(e) =>
                        setSelectedRegionId(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    >
                      <option value="">Select region</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Province */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Province *</label>
                    <select
                      value={selectedProvinceId}
                      onChange={(e) =>
                        setSelectedProvinceId(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      disabled={!selectedRegionId}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    >
                      <option value="">
                        {selectedRegionId
                          ? "Select province"
                          : "Select region first"}
                      </option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Locality */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Locality *</label>
                    <select
                      value={selectedLocalityId}
                      onChange={(e) =>
                        setSelectedLocalityId(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      disabled={!selectedProvinceId}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    >
                      <option value="">
                        {selectedProvinceId
                          ? "Select locality"
                          : "Select province first"}
                      </option>
                      {localities.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SHORT DESCRIPTION */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold">
                    Short description
                  </label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="h-20 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    placeholder="Quick teaser (1–2 sentences)"
                  />
                </div>

                {/* LONG DESCRIPTION */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold">
                    Full story / details
                  </label>
                  <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    className="h-32 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    placeholder="Best dishes? Tips? Ambience?"
                  />
                </div>

                {/* ADDRESS + PRICE */}
                <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">
                      Address or landmark
                    </label>
                    <input
                      type="text"
                      value={addressText}
                      onChange={(e) => setAddressText(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                      placeholder="Near barangay hall"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold">
                      Budget level
                    </label>
                    <select
                      value={avgCostHint}
                      onChange={(e) =>
                        setAvgCostHint(
                          e.target.value as "budget" | "mid" | "premium"
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    >
                      <option value="budget">Budget-friendly</option>
                      <option value="mid">Mid-range</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>

                {/* COVER IMAGE */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold">
                    Cover image URL
                  </label>
                  <input
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f47a44]"
                    placeholder="Temporary URL (uploads coming soon)"
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  {/* LEFT: Delete (only in edit mode) */}
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
                    >
                      <span>Delete this gem</span>
                    </button>
                  )}

                  {/* RIGHT: Cancel + Save/Post */}
                  <div className="ml-auto flex gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-full bg-[#f47a44] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#e96b32] disabled:opacity-60"
                    >
                      {isEditMode ? "Save changes" : "Post hidden gem"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </AnimatedSection>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default ShopFormPage;
