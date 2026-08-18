import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router";
import ProtectedRoute from "./components/core/ProtectedRoute";

const loadHome = () =>
  import("./components/pages/Home").then((m) => ({ default: m.Home }));
const loadSignIn = () => import("./components/pages/signIn");
const loadSignUp = () => import("./components/pages/signUp");
const loadSharedBrain = () =>
  import("./components/pages/SharedBrain").then((m) => ({ default: m.SharedBrain }));

const Home = lazy(loadHome);
const SignInPage = lazy(loadSignIn);
const SignUpPage = lazy(loadSignUp);
const SharedBrain = lazy(loadSharedBrain);

export const prefetchRoutes = () => {
  void loadHome();
  void loadSignIn();
  void loadSignUp();
  void loadSharedBrain();
};

function AppLoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(() => prefetchRoutes());
      return () => window.cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => prefetchRoutes(), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Suspense fallback={<AppLoadingFallback />}>
      <Routes>
        <Route path="/signup/*" element={<SignUpPage />} />
        <Route path="/signin/*" element={<SignInPage />} />
        <Route path="/share/:shareId" element={<SharedBrain />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
