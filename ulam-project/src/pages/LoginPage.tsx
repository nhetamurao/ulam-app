import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimatedSection from "../components/AnimatedSection";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-orange-100 via-white to-orange-200 px-4 sm:px-6">
      <AnimatedSection direction="up" className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/80 px-6 py-7 sm:px-8 sm:py-8">
          <h1 className="text-2xl font-extrabold text-[#f47a44] text-center mb-3">
            Welcome back
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Log in to continue exploring hidden gems.
          </p>

          {error && (
            <p className="mb-4 text-xs text-center text-red-500">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full h-11 rounded-xl border border-gray-300 bg-slate-50 px-4 text-sm focus:border-[#f47a44] focus:ring-1 focus:ring-[#f47a44] focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                className="mt-1 w-full h-11 rounded-xl border border-gray-300 bg-slate-50 px-4 text-sm focus:border-[#f47a44] focus:ring-1 focus:ring-[#f47a44] focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full h-11 rounded-xl bg-[#f47a44] text-white font-semibold text-sm hover:bg-[#e3672c] transition disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#f47a44] font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default LoginPage;
