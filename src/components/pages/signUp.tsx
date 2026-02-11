import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signup } from "../../api/auth";

export default function Signup() {
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
      await signup(form);
      toast.success("Signup successful");
      navigate("/signin");
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-50 flex items-center justify-center bg-neutral-950 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center justify-center">
        <div className="p-6 flex flex-col justify-center md:items-start items-center">
          <h1 className="text-4xl font-bold">Brainly</h1>

          <p className="mt-2 text-neutral-500 max-w-sm">
            Create your account and start organizing your knowledge effortlessly.
          </p>

          <p className="mt-4 text-sm text-neutral-400 max-w-sm">
            We all collect ideas, links, and thoughts every day. Brainly gives them a
            home, so your mind can stay clear and focused on what matters most.
          </p>

          <p className="mt-3 text-sm text-neutral-500">
            Build clarity. One thought at a time.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 text-neutral-50 p-4 rounded-xl border border-white/5 backdrop-blur-3xl w-full max-w-sm mx-auto space-y-4"
        >
          <div className="flex flex-col gap-y-2 py-2">
            <h1 className="text-md font-bold">Create an account</h1>
            <p className="text-sm text-neutral-400">
              Enter your information below to create your account
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
            className="w-full bg-white text-black py-3 mt-4 rounded-2xl cursor-pointer"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            Already have an account?
            <span
              onClick={() => navigate("/signin")}
              className="text-neutral-300 cursor-pointer underline ml-1"
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
