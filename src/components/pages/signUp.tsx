import { SignUp, useAuth } from "@clerk/react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const SignUpPage = () => {
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-500">
        Loading...
      </main>
    );
  }

  if (isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-500">
        Redirecting...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 px-4 py-8 sm:px-6 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(10,10,10,1),rgba(2,6,23,1))]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)]">
          <section className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-neutral-300">
              Brainly setup
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build a brain that feels easy to revisit
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-neutral-300">
              Create your account, start saving content in one place, and keep a
              clean system that looks good on phone and desktop.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {["Responsive notes", "Clean organization", "Public sharing"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-neutral-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-4 rounded-[36px] blur-2xl" />
            <div className="relative">
              <SignUp
                path="/signup"
                routing="path"
                signInUrl="/signin"
                oauthFlow="auto"
                forceRedirectUrl="/"
                fallbackRedirectUrl="/"
              />
            </div>

          </section>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
