import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import AnimatedSection from "../components/AnimatedSection";
import { useAuth } from "../context/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "/api";

type Locality = {
  id: number;
  name: string;
  locality_type: string;
};

type Province = {
  id: number;
  name: string;
};

type Region = {
  id: number;
  name: string;
};

type Photo = {
  id: number;
  url: string;
};

type CommentUser = {
  id: number;
  name: string;
};

type Comment = {
  id: number;
  body: string | null;
  created_at: string | null;
  user: CommentUser;
};

type ShopDetail = {
  id: number;
  name: string;
  short_description: string | null;
  long_description: string | null;
  cover_image_url: string | null;
  average_rating: number | null;
  price_level: string | null;
  locality: Locality;
  province: Province;
  region: Region;
  photos: Photo[];
  comments: Comment[];
};

const unwrapSingle = <T,>(payload: unknown): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as any).data as T;
  }
  return payload as T;
};

const HiddenGemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // comment form state
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // comment actions state
  const [actionMenuOpenId, setActionMenuOpenId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // ----------------------------------------------------
  // Load shop info
  // ----------------------------------------------------
  useEffect(() => {
    if (!id) return;

    const loadShop = async () => {
      const url = `${API_BASE}/shops/${id}`;
      console.log("Fetching shop details from:", url);

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const res = await fetch(url);

        if (!res.ok) {
          const bodyText = await res.text();
          console.error("Error body:", bodyText);
          throw new Error(`Failed to load shop. Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Shop raw JSON:", data);

        const shopPayload = unwrapSingle<ShopDetail>(data);
        setShop(shopPayload);
      } catch (err) {
        console.error("Failed to load shop:", err);
        setErrorMessage("Unable to load this hidden gem.");
      } finally {
        setIsLoading(false);
      }
    };

    loadShop();
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const locationLine = shop
    ? [shop.locality?.name, shop.province?.name, shop.region?.name]
        .filter(Boolean)
        .join(" • ")
    : "";

  const heroImage =
    shop?.cover_image_url ||
    (shop?.photos?.length ? shop.photos[0].url : undefined);

  const reviewsCount = shop?.comments?.length ?? 0;

  // ----------------------------------------------------
  // Handle comment submission (with auth)
  // ----------------------------------------------------
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    if (!user || !token) {
      setCommentError("You need to be logged in to post a review.");
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed) {
      setCommentError("Please write something before posting.");
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentError(null);

      const res = await fetch(`${API_BASE}/shops/${shop.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Sanctum token
        },
        body: JSON.stringify({ body: trimmed }),
      });

      const text = await res.text();
      if (!res.ok) {
        console.error("Comment save error body:", text);
        throw new Error("Failed to save comment");
      }

      let payload: any;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }

      const savedComment = unwrapSingle<Comment>(payload);

      // Prepend new comment to list
      setShop((prev) =>
        prev
          ? {
              ...prev,
              comments: [savedComment, ...(prev.comments || [])],
            }
          : prev
      );

      setNewComment("");
    } catch (err) {
      console.error(err);
      setCommentError(
        "Something went wrong while posting your review. Please try again."
      );
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // ----------------------------------------------------
  // Handle comment deletion (only own comment)
  // ----------------------------------------------------
  const handleDeleteComment = async (commentId: number) => {
    if (!token) {
      setCommentError("You need to be logged in to delete a review.");
      return;
    }

    try {
      setCommentError(null);
      setActionMenuOpenId(null);

      const res = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        setCommentError("You can only delete your own review.");
        return;
      }

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Comment delete error body:", text);
        throw new Error("Failed to delete comment");
      }

      // Remove from local state
      setShop((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((c) => c.id !== commentId),
            }
          : prev
      );

      // if you were editing this one, reset edit state
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditingText("");
      }
    } catch (err) {
      console.error(err);
      setCommentError(
        "Something went wrong while deleting your review. Please try again."
      );
    }
  };

  // ----------------------------------------------------
  // Handle comment edit (inline)
  // ----------------------------------------------------
  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.body ?? "");
    setActionMenuOpenId(null);
    setCommentError(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!token || !user) {
      setCommentError("You need to be logged in to edit a review.");
      return;
    }

    const trimmed = editingText.trim();
    if (!trimmed) {
      setCommentError("Review cannot be empty.");
      return;
    }

    try {
      setIsSavingEdit(true);
      setCommentError(null);

      const res = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: trimmed }),
      });

      const text = await res.text();
      if (!res.ok) {
        console.error("Comment update error body:", text);
        throw new Error("Failed to update comment");
      }

      let payload: any;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }

      const updatedComment = unwrapSingle<Comment>(payload);

      // Update comment in local state
      setShop((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.map((c) =>
                c.id === commentId ? { ...c, body: updatedComment.body } : c
              ),
            }
          : prev
      );

      setEditingCommentId(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
      setCommentError(
        "Something went wrong while updating your review. Please try again."
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  const toggleActionMenu = (commentId: number) => {
    setActionMenuOpenId((prev) => (prev === commentId ? null : commentId));
  };

  return (
    <main className="pt-20 md:pt-24 flex-1 bg-[#f3f4f6] text-[#111827]">
      {/* Animated page container */}
      <AnimatedSection className="mx-auto w-full max-w-5xl lg:max-w-6xl px-4 sm:px-6 lg:px-10 pb-20">
        {/* Back + Edit header */}
        <AnimatedSection direction="up" className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#f97316] hover:text-[#ea580c] hover:underline"
          >
            <span>Back to hidden gems</span>
          </button>

          {shop && user && (
            <Link
              to={`/gems/${shop.id}/edit`}
              className="inline-flex items-center gap-1 rounded-full border border-[#f97316]/80 bg-white px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#f97316] shadow-sm hover:bg-[#fff7ed] hover:border-[#ea580c] transition-colors"
            >
              <span>Edit Gem</span>
            </Link>
          )}
        </AnimatedSection>

        {/* Loading state */}
        {isLoading && (
          <p className="mt-6 text-sm text-gray-600">Loading hidden gem…</p>
        )}

        {/* Error state */}
        {!isLoading && errorMessage && (
          <p className="mt-6 text-sm text-red-500">{errorMessage}</p>
        )}

        {/* Success state */}
        {!isLoading && !errorMessage && shop && (
          <>
            {/* Main shop card */}
            <AnimatedSection
              direction="up"
              delay={0.05}
              className="overflow-hidden rounded-3xl bg-white shadow-md md:shadow-lg border border-slate-200"
            >
              {heroImage && (
                <div className="h-60 w-full md:h-72 lg:h-80 overflow-hidden">
                  <img
                    src={heroImage}
                    alt={shop.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              <div className="p-5 md:p-8 lg:p-9">
                {/* Title + rating row */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-8">
                  <div className="flex-1 space-y-2">
                    <h1 className="text-2xl md:text-3xl lg:text-[1.9rem] font-extrabold tracking-tight text-slate-900">
                      {shop.name}
                    </h1>
                    {locationLine && (
                      <p className="flex items-center gap-1 text-xs md:text-sm text-slate-500">
                        <span>{locationLine}</span>
                      </p>
                    )}
                    <p className="mt-3 text-sm md:text-[0.95rem] leading-relaxed text-slate-700 max-w-2xl lg:max-w-none">
                      {shop.short_description ||
                        "No short description yet. This spot is waiting for its first full story."}
                    </p>
                  </div>

                  {(shop.average_rating !== null ||
                    shop.price_level ||
                    reviewsCount > 0) && (
                    <div className="flex flex-col items-start lg:items-end gap-2 min-w-[10rem]">
                      {shop.average_rating !== null && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
                          <span className="text-sm font-semibold text-amber-600">
                            ★ {shop.average_rating.toFixed(1)}
                          </span>
                          <span className="text-[11px] text-amber-700">
                            {reviewsCount > 0
                              ? `${reviewsCount} review${
                                  reviewsCount === 1 ? "" : "s"
                                }`
                              : "No reviews yet"}
                          </span>
                        </div>
                      )}
                      {shop.price_level && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                          💸 {shop.price_level}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Long description */}
                <div className="mt-6 text-sm md:text-[0.95rem] leading-relaxed text-slate-700">
                  {shop.long_description ? (
                    <p className="whitespace-pre-line">{shop.long_description}</p>
                  ) : (
                    <p>
                      No detailed write-up has been added yet. You can still
                      visit and experience the gem yourself!
                    </p>
                  )}
                </div>

                {/* Meta chips */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] md:text-xs">
                  {shop.locality?.name && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      🏘️ {shop.locality.name}
                    </span>
                  )}
                  {shop.province?.name && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      🏙️ {shop.province.name}
                    </span>
                  )}
                  {shop.region?.name && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      🌏 {shop.region.name}
                    </span>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Photos preview */}
            {shop.photos && shop.photos.length > 1 && (
              <AnimatedSection direction="up" delay={0.1} className="mt-10">
                <h2 className="text-sm font-semibold text-slate-800">
                  More photos
                </h2>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {shop.photos.slice(0, 8).map((photo) => (
                    <div
                      key={photo.id}
                      className="h-24 sm:h-28 md:h-32 overflow-hidden rounded-2xl bg-slate-200"
                    >
                      <img
                        src={photo.url}
                        alt={shop.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Comments + form */}
            <AnimatedSection direction="up" delay={0.15} className="mt-12">
              <section>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900">
                      Reviews & stories
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">
                      Share your experience to help others discover this gem.
                    </p>
                    {user && (
                      <p className="text-[11px] md:text-xs text-slate-500 mt-1">
                        Reviewing as{" "}
                        <span className="font-semibold">{user.name}</span>
                      </p>
                    )}
                    {!user && (
                      <p className="text-[11px] md:text-xs text-slate-500 mt-1">
                        <Link
                          to="/login"
                          className="text-[#f97316] font-semibold hover:underline"
                        >
                          Log in
                        </Link>{" "}
                        to share your own review.
                      </p>
                    )}
                  </div>
                  {reviewsCount > 0 && (
                    <span className="self-start sm:self-auto text-[11px] rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                      {reviewsCount} review{reviewsCount === 1 ? "" : "s"}
                    </span>
                  )}
                </div>

                {/* Comment form */}
                <form
                  onSubmit={handleSubmitComment}
                  className="mt-2 space-y-3 rounded-2xl bg-white px-4 py-4 md:px-6 md:py-5 shadow-md border border-slate-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-semibold text-slate-800">
                        Share your experience
                      </span>
                      <span className="text-[11px] md:text-xs text-slate-500">
                        Please be kind, specific, and helpful
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={
                      user
                        ? "What did you like about this place? Any tips for others?"
                        : "Log in to share your thoughts about this place."
                    }
                    className="mt-1 h-24 md:h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs md:text-sm text-slate-800 shadow-inner focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] focus:outline-none resize-none"
                    disabled={!user || isSubmittingComment}
                  />
                  {commentError && (
                    <p className="text-[11px] md:text-xs text-red-500">
                      {commentError}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-[11px] md:text-xs text-slate-400">
                      By posting, you agree to keep your review respectful.
                    </span>
                    <button
                      type="submit"
                      disabled={
                        isSubmittingComment || !newComment.trim() || !user
                      }
                      className="self-end sm:self-auto rounded-full bg-[#f97316] px-4 py-1.5 text-xs md:text-sm font-semibold text-white shadow-[0_4px_12px_rgba(249,115,22,0.45)] hover:bg-[#ea580c] disabled:opacity-60 disabled:shadow-none transition-colors"
                    >
                      {isSubmittingComment ? "Posting…" : "Post review"}
                    </button>
                  </div>
                </form>

                {/* Existing comments */}
                {shop.comments && shop.comments.length > 0 ? (
                  <div className="mt-5 space-y-4 text-sm">
                    {shop.comments.slice(0, 10).map((comment) => {
                      const initial =
                        comment.user?.name?.charAt(0).toUpperCase() ?? "U";
                      const isOwner =
                        user && comment.user && comment.user.id === user.id;
                      const isEditing = editingCommentId === comment.id;

                      return (
                        <article
                          key={comment.id}
                          className="rounded-2xl bg-white px-4 py-3 md:px-5 md:py-4 shadow-sm border border-slate-200"
                        >
                          <div className="flex items-start gap-3 md:gap-4">
                            {/* Avatar */}
                            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#ec4899] text-xs md:text-sm font-semibold text-white">
                              {initial}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs md:text-sm font-semibold text-slate-900">
                                    {comment.user?.name || "Ulam user"}
                                  </span>
                                  {isOwner && (
                                    <span className="text-[10px] text-slate-400 border border-slate-200 rounded-full px-2 py-[2px]">
                                      You
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 relative">
                                  <span className="text-[10px] md:text-[11px] text-slate-400 whitespace-nowrap">
                                    {comment.created_at
                                      ? new Date(
                                          comment.created_at
                                        ).toLocaleDateString()
                                      : ""}
                                  </span>

                                  {isOwner && (
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleActionMenu(comment.id)
                                        }
                                        className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                                      >
                                        ⋯
                                      </button>

                                      {actionMenuOpenId === comment.id && (
                                        <div className="absolute right-0 mt-1 w-28 rounded-lg bg-white shadow-lg border border-slate-200 z-10 text-[11px]">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleStartEdit(comment)
                                            }
                                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteComment(comment.id)
                                            }
                                            className="w-full text-left px-3 py-1.5 text-red-500 hover:bg-red-50"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Comment body or edit textarea */}
                              {isEditing ? (
                                <div className="mt-2 space-y-2">
                                  <textarea
                                    value={editingText}
                                    onChange={(e) =>
                                      setEditingText(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs md:text-sm text-slate-800 shadow-inner focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] focus:outline-none resize-none"
                                    rows={3}
                                  />
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      className="text-[11px] px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSaveEdit(comment.id)
                                      }
                                      disabled={
                                        isSavingEdit || !editingText.trim()
                                      }
                                      className="text-[11px] px-3 py-1 rounded-full bg-[#f97316] text-white font-semibold shadow-sm hover:bg-[#ea580c] disabled:opacity-60"
                                    >
                                      {isSavingEdit ? "Saving…" : "Save"}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-slate-700">
                                  {comment.body || "No review text yet."}
                                </p>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-xs md:text-sm text-slate-500">
                    No reviews yet. Be the first to share your experience here!
                  </p>
                )}
              </section>
            </AnimatedSection>
          </>
        )}
      </AnimatedSection>

      <Footer />
    </main>
  );
};

export default HiddenGemDetailsPage;
