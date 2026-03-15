import { ClerkProvider, useAuth } from "@clerk/react-router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { clearTokenGetter, setTokenGetter } from "./api/axios";
import App from "./App";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const DASHBOARD_PATH = "/";
const SIGN_IN_PATH = "/signin";
const SIGN_UP_PATH = "/signup";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env");
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "bottom",
    privacyPageUrl: "https://clerk.com/privacy",
    termsPageUrl: "https://clerk.com/terms",
  },
  variables: {
    colorPrimary: "#686868d0",
    colorBackground: "#181818ff",
    colorInputBackground: "#151515ff",
    colorInputText: "#000000",
    colorText: "#ffffff",

    colorTextSecondary: "#e5e5e5",
    colorNeutral: "#a3a3a3",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",
    borderRadius: "0.75rem",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "14px",
  },
  elements: {
    card: "border-none shadow-xl",
    headerTitle: "text-white",
    headerSubtitle: "text-neutral-200",
    socialButtonsBlockButton: "border-none text-white bg-white/10 hover:bg-white/20",
    formButtonPrimary: "bg-violet-600 hover:bg-violet-700 text-white",
    // background and white text
    formFieldInput: "border-none bg-[#141414] text-black focus:ring-1 focus:ring-violet-500",
    footerActionText: "text-neutral-400",
    footerActionLink: "text-violet-400 hover:text-violet-300",
    navbar: "border-none bg-[#272727]",
    scrollBox: "bg-[#272727]",
    pageScrollBox: "bg-[#272727]",
    page: "bg-[#272727]",
    profileSection: "border-none bg-[#2f2f2f]",
    profileSectionItem: "border-none bg-[#3f3f3f]/50",
    badge: "border-none bg-violet-500/10 text-violet-400",

    navbarButtonText: "text-[#e5e5e5] font-medium",
    navbarButtonIcon: "text-[#a3a3a3]",
    profileSectionTitleText: "text-white font-semibold",
    profileSectionSubtitleText: "text-[#e5e5e5]",
    profileSectionPrimaryButton: "text-[#e5e5e5] bg-[#3f3f3f] hover:bg-[#4f4f4f] border-none",
    identityPreviewText: "text-white",
    identityPreviewEditButton: "text-violet-400 hover:text-violet-300",
    // Fix uploaded avatar / text buttons
    profileSectionPrimaryButtonText: "text-white",
  },
} as const;

export function TokenSync() {
  const { getToken, isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  useEffect(() => {
    setTokenGetter(async () => {
      if (!isLoaded || !isSignedIn) {
        return null;
      }

      for (let attempt = 0; attempt < 4; attempt += 1) {
        const token = await getToken();

        if (token) {
          return token;
        }

        await wait(150 * (attempt + 1));
      }

      return null;
    });

    return () => {
      clearTokenGetter();
    };
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}

export default function ClerkApp() {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl={SIGN_IN_PATH}
      signUpUrl={SIGN_UP_PATH}
      afterSignOutUrl="/signin"
      signInFallbackRedirectUrl={DASHBOARD_PATH}
      signUpFallbackRedirectUrl={DASHBOARD_PATH}
      signInForceRedirectUrl={DASHBOARD_PATH}
      signUpForceRedirectUrl={DASHBOARD_PATH}
      appearance={clerkAppearance}
    >
      <TokenSync />
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#171717",
            color: "#e5e5e5",
            border: "1px solid #262626",
          },
        }}
      />
    </ClerkProvider>
  );
}
