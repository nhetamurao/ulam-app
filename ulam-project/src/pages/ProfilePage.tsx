import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

type ShopSummary = {
  id: number;
  name: string;
  short_description: string | null;
  locality?: { name: string } | null;
  province?: { name: string } | null;
  region?: { name: string } | null;
};

type ReviewSummary = {
  id: number;
  body: string | null;
  created_at: string | null;
  shop?: { id: number; name: string } | null;
};

const unwrapCollection = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const p = payload as { data?: unknown };
    return Array.isArray(p.data) ? (p.data as T[]) : [];
  }
  return [];
};

const ProfilePage: React.FC = () => {
  const { user, isAuthReady, token } = useAuth();
  const navigate = useNavigate();

  const [myShops, setMyShops] = useState<ShopSummary[]>([]);
  const [myReviews, setMyReviews] = useState<ReviewSummary[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorShops, setErrorShops] = useState<string | null>(null);
  const [errorReviews, setErrorReviews] = useState<string | null>(null);

  // Only redirect once auth state is fully initialized
  useEffect(() => {
    if (isAuthReady && !user) {
      navigate("/login");
    }
  }, [isAuthReady, user, navigate]);

  // Fetch "my shops" + "my reviews" once auth is ready and user/token exist
  useEffect(() => {
    if (!isAuthReady || !user || !token) return;

    const loadMyShops = async () => {
      try {
        setLoadingShops(true);
        setErrorShops(null);

        const res = await fetch(`${API_BASE}/me/shops`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("My shops error body:", text);
          throw new Error("Failed to load your hidden gems.");
        }

        const data = await res.json();
        setMyShops(unwrapCollection<ShopSummary>(data));
      } catch (err) {
        console.error(err);
        setErrorShops("Unable to load your hidden gems right now.");
      } finally {
        setLoadingShops(false);
      }
    };

    const loadMyReviews = async () => {
      try {
        setLoadingReviews(true);
        setErrorReviews(null);

        const res = await fetch(`${API_BASE}/me/comments`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("My reviews error body:", text);
          throw new Error("Failed to load your reviews.");
        }

        const data = await res.json();
        setMyReviews(unwrapCollection<ReviewSummary>(data));
      } catch (err) {
        console.error(err);
        setErrorReviews("Unable to load your reviews right now.");
      } finally {
        setLoadingReviews(false);
      }
    };

    loadMyShops();
    loadMyReviews();
  }, [isAuthReady, user, token]);

  // While figuring out if user is logged in or not
  if (!isAuthReady) {
    return (
      <main className="pt-20 md:pt-24 min-h-screen bg-[#ffffff] text-[#1e1e1e]">
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <p className="text-sm text-gray-600">Loading your profile…</p>
        </section>
      </main>
    );
  }

  // After auth is ready and user is definitely not logged in,
  // the useEffect will already have kicked a redirect.
  if (!user) {
    return null;
  }

  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() ?? "U";

  return (
      <div className="min-h-screen bg-white flex flex-col">      <main className="pt-20 md:pt-24 flex-1">
        <section className="mx-auto max-w-5xl px-4 md:px-6 pb-16">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-semibold shadow-md">
                {initial}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#1e1e1e]">
                  Hi, {user.name}
                </h1>
                <p className="text-sm text-gray-600">
                  This is your Ulam profile. Manage your account and keep track
                  of the gems you share.
                </p>
              </div>
            </div>
          </div>

          {/* Top cards: account + overview */}
          <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
            {/* Account details */}
            <div className="rounded-2xl bg-white/90 shadow-md border border-orange-50 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-800">
                Account details
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Name
                  </p>
                  <p className="text-gray-800">{user.name}</p>
                </div>
                {user.email && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Email
                    </p>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activity / overview */}
            <div className="rounded-2xl bg-white/90 shadow-md border border-slate-100 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-800">
                Your activity
              </h2>
              <p className="text-sm text-gray-600">
                Here’s a quick snapshot of your contributions to the Ulam
                community.
              </p>
              <div className="flex gap-3 mt-2 text-sm">
                <div className="flex-1 rounded-xl bg-orange-50 border border-orange-100 px-3 py-2 flex flex-col gap-1">
                  <span className="text-xs text-orange-700 font-medium">
                    Hidden gems
                  </span>
                  <span className="text-lg font-extrabold text-orange-700">
                    {myShops.length}
                  </span>
                </div>
                <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 flex flex-col gap-1">
                  <span className="text-xs text-slate-700 font-medium">
                    Reviews
                  </span>
                  <span className="text-lg font-extrabold text-slate-800">
                    {myReviews.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom sections: My hidden gems + My reviews */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* My hidden gems */}
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  My hidden gems
                </h3>
                <span className="text-[11px] text-gray-400">
                  {loadingShops ? "Loading…" : `${myShops.length} total`}
                </span>
              </div>

              {errorShops && (
                <p className="text-xs text-red-500 mb-2">{errorShops}</p>
              )}

              {!loadingShops && !errorShops && myShops.length === 0 && (
                <p className="text-xs text-gray-500">
                  You haven’t posted any hidden gems yet. Start by sharing a
                  favorite local spot!
                </p>
              )}

              {!loadingShops && myShops.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {myShops.slice(0, 5).map((shop) => (
                    <li
                      key={shop.id}
                      className="rounded-xl border border-slate-100 bg-white px-3 py-2 hover:border-orange-200 hover:bg-orange-50/60 transition-colors"
                    >
                      <Link
                        to={`/gems/${shop.id}`}
                        className="flex flex-col gap-0.5"
                      >
                        <span className="text-sm font-semibold text-slate-900">
                          {shop.name}
                        </span>
                        {shop.short_description && (
                          <span className="text-[11px] text-slate-500 line-clamp-2">
                            {shop.short_description}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {[shop.locality?.name, shop.province?.name]
                            .filter(Boolean)
                            .join(" • ")}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* My reviews */}
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  My reviews
                </h3>
                <span className="text-[11px] text-gray-400">
                  {loadingReviews ? "Loading…" : `${myReviews.length} total`}
                </span>
              </div>

              {errorReviews && (
                <p className="text-xs text-red-500 mb-2">{errorReviews}</p>
              )}

              {!loadingReviews && !errorReviews && myReviews.length === 0 && (
                <p className="text-xs text-gray-500">
                  You haven’t written any reviews yet. Visit a hidden gem and
                  share your experience.
                </p>
              )}

              {!loadingReviews && myReviews.length > 0 && (
                <ul className="mt-2 space-y-2">
                  {myReviews.slice(0, 5).map((review) => (
                    <li
                      key={review.id}
                      className="rounded-xl border border-slate-100 bg-white px-3 py-2 hover:border-slate-300 transition-colors"
                    >
                      <Link
                        to={
                          review.shop?.id
                            ? `/gems/${review.shop.id}`
                            : "#"
                        }
                        className="flex flex-col gap-0.5"
                      >
                        <span className="text-xs font-semibold text-slate-900">
                          {review.shop?.name || "Unknown place"}
                        </span>
                        <span className="text-[11px] text-slate-600 line-clamp-2">
                          {review.body || "No review text."}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {review.created_at
                            ? new Date(
                                review.created_at
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
