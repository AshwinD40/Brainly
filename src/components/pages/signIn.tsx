import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signin } from "../../api/auth";

export default function Signin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const errors = {
    username: submitted && !form.username.trim(),
    password: submitted && !form.password.trim(),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!form.username.trim() || !form.password.trim()) {
      return;
    }

    setLoading(true);

    try {
      await signin(form);
      toast.success("Welcome back");
      navigate("/");
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-50 flex items-center justify-center bg-neutral-950 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center justify-center">
        <div className="p-6 flex flex-col justify-center md:items-start items-center">
          <h1 className="text-4xl font-bold">Brainly</h1>
          <p className="mt-2 text-neutral-500 max-w-sm">
            Welcome back. Let&apos;s get you back to your ideas.
          </p>
          <p className="mt-4 text-sm text-neutral-400 max-w-sm">
            Pick up right where you left off and keep building your second brain.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 p-4 rounded-xl text-neutral-50 border border-white/5 backdrop-blur-3xl w-full max-w-sm mx-auto space-y-4"
        >
          <div className="flex flex-col gap-y-2 py-2">
            <h1 className="text-md font-bold">Sign in</h1>
            <p className="text-sm text-neutral-400">
              Enter your information below to sign in
            </p>
          </div>

          <label className="block text-sm mb-1">Username</label>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className={`form-input mb-1 ${
              errors.username ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-xs">Username is required</p>
          )}

          <label className="block text-sm mb-1 mt-4">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={`form-input mb-1 ${
              errors.password ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">Password is required</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-2xl cursor-pointer mt-4"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Don&apos;t have an account?
            <span
              onClick={() => navigate("/signup")}
              className="text-neutral-300 cursor-pointer underline ml-1"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
