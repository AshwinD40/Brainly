import { SignIn, useAuth } from "@clerk/react-router";
import { Navigate } from "react-router";

const SignInPage = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a0a]">
        <div className="h-5 w-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </main>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="flex min-h-[100dvh] w-full bg-[#0a0a0a]">
      {/* ── Left Side: Marketing & Branding (Hidden on Mobile) ── */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/5 bg-[#121212] lg:flex">
        {/* Background glow effects */}
        <div aria-hidden className="absolute inset-0 z-0">
          <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
        </div>

        {/* Top Logo */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Brainly</span>
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 pb-24 max-w-2xl">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:leading-[1.1]">
            Your mind, <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              perfectly organized.
            </span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-neutral-400">
            Welcome back to your second brain. Capture thoughts, manage projects, and connect ideas faster than ever before.
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-neutral-300">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-[#121212] bg-neutral-800 flex items-center justify-center overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 20}`} alt="User avatar" />
                </div>
              ))}
            </div>
            <p>Join 10,000+ thinkers</p>
          </div>
        </div>
      </div>

      {/* ── Right Side: Auth Form ── */}
      <div className="relative flex w-full flex-col items-center justify-center bg-[#0a0a0a] p-4 lg:w-1/2 lg:p-12">
        {/* Subtle mobile-only glow */}
        <div aria-hidden className="absolute inset-0 z-0 lg:hidden pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
        </div>

        {/* Mobile Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 lg:hidden w-full relative z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20">
              <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Brainly</span>
        </div>

        {/* Form Container */}
        <div className="relative z-10 w-full max-w-full sm:max-w-[420px]">
          <SignIn
            path="/signin"
            routing="path"
            signUpUrl="/signup"
            forceRedirectUrl="/"
            fallbackRedirectUrl="/"
          />
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
