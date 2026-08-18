import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import axios from "axios";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import favicon from "../../assets/favicon.png";

const SignInPage = () => {
  const { user, loading, signin, signinWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400 font-sans text-sm">
        <div className="h-6 w-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </main>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await signin({ email, password });
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? err.message)
        : "Failed to sign in";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) {
      toast.error("Google sign-in failed");
      return;
    }

    try {
      setIsSubmitting(true);
      await signinWithGoogle(credentialResponse.credential);
      toast.success("Signed in with Google!");
      navigate("/");
    } catch (err) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? (err.response?.data?.message ?? err.message)
        : "Google authentication failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-950 px-4 py-12 text-neutral-100 font-sans">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-600/25 via-indigo-600/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-[-10%] h-[400px] w-[500px] rounded-full bg-purple-600/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-40 h-[350px] w-[450px] -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8 sm:p-10 shadow-[0_24px_80px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(139,92,246,0.1)] backdrop-blur-2xl">
          
          <div className="mb-7 flex flex-col items-center text-center">
            <Link
              to="/"
              className="group mb-4 flex items-center justify-center rounded-2xl border border-white/10 bg-neutral-950/70 p-2.5 shadow-lg shadow-violet-950/30 transition-all duration-300 hover:border-violet-500/40 hover:scale-105"
            >
              <img
                src={favicon}
                alt="Brainly"
                className="h-8 w-8 object-contain rounded-lg"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-neutral-400">
              Sign in to your personal second brain
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-neutral-300">
                Email address
              </label>
              <div className="relative flex items-center">
                <FiMail className="pointer-events-none absolute left-3.5 text-sm text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 backdrop-blur-md transition-all duration-200 focus:border-violet-500/60 focus:bg-neutral-950/90 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-neutral-300">
                Password
              </label>
              <div className="relative flex items-center">
                <FiLock className="pointer-events-none absolute left-3.5 text-sm text-neutral-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder-neutral-500 backdrop-blur-md transition-all duration-200 focus:border-violet-500/60 focus:bg-neutral-950/90 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all duration-200 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-600/40 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="text-sm transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8 flex items-center justify-center">
            <span className="w-full border-t border-white/10" />
            <span className="absolute rounded-full bg-neutral-900/90 px-3 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500 backdrop-blur-md border border-white/5">
              or sign in with Google
            </span>
          </div>

          <div className="flex justify-center w-full">
            <div className="rounded-full border border-white/10 bg-neutral-950/10 p-0.5 backdrop-blur-xl shadow-inner transition-all hover:border-white/20">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                theme="filled_black"
                shape="pill"
                text="continue_with"
              />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-violet-400 transition-colors hover:text-violet-300">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
};

export default SignInPage;
