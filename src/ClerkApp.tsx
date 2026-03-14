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
  variables: {
    colorPrimary: "#f8fafc",
    colorBackground: "transparent",
    colorInputBackground: "rgba(2, 6, 23, 0.42)",
    colorInputText: "#f8fafc",
    colorText: "#f8fafc",
    colorTextSecondary: "#cbd5e1",
    colorNeutral: "#64748b",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full max-w-[440px]",
    card: "rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(30,41,59,0.88),rgba(15,23,42,0.96))] shadow-[0_34px_90px_-48px_rgba(0,0,0,0.98)] backdrop-blur-2xl",
    headerTitle: "text-xl sm:text-2xl font-semibold tracking-tight text-white",
    headerSubtitle: "text-sm text-neutral-300",
    formFieldLabel: "text-sm font-medium text-neutral-300",
    formFieldInput:
      "h-11 rounded-2xl border border-white/14 bg-white/[0.08] text-white placeholder:text-neutral-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:border-sky-300/45 focus:bg-white/[0.1]",
    formFieldInputShowPasswordButton: "text-neutral-400 hover:text-white",
    socialButtonsRoot: "gap-3",
    socialButtonsBlockButton:
      "h-11 rounded-2xl border border-white/16 bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/28 hover:bg-white/[0.16]",
    socialButtonsBlockButtonText: "font-medium text-neutral-100",
    socialButtonsProviderIcon: "opacity-100 brightness-110",
    dividerRow: "my-4",
    dividerLine: "bg-white/10",
    dividerText:
      "px-3 text-[11px] uppercase tracking-[0.24em] text-neutral-400 bg-transparent",
    formButtonPrimary:
      "h-11 rounded-2xl bg-[linear-gradient(135deg,#f8fafc,#cbd5e1)] font-semibold text-slate-950 shadow-[0_16px_36px_-24px_rgba(248,250,252,0.85)] hover:brightness-105",
    footerAction: "bg-transparent",
    footerActionText: "text-neutral-400",
    footerActionLink: "text-neutral-100 underline-offset-4 hover:text-white",
    identityPreview: "rounded-2xl border border-white/10 bg-white/[0.05] shadow-none",
    identityPreviewText: "text-neutral-100",
    identityPreviewEditButton: "text-neutral-300 hover:text-white",
    modalBackdrop:
      "bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.14),transparent_28%),rgba(3,7,18,0.72)] backdrop-blur-md",
    modalContent:
      "rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(30,41,59,0.92),rgba(15,23,42,0.98))] p-1 shadow-[0_40px_100px_-52px_rgba(0,0,0,1)] backdrop-blur-2xl sm:p-2",
    modalCloseButton:
      "border border-white/10 bg-white/[0.05] text-neutral-300 hover:bg-white/[0.08] hover:text-white",
    scrollBox: "bg-transparent",
    pageScrollBox: "bg-transparent px-1 pb-1 sm:px-2 sm:pb-2",
    page: "bg-transparent",
    navbar:
      "border-r border-white/10 bg-black/18 px-2 py-3 backdrop-blur-xl sm:px-3",
    navbarButtons: "gap-1.5",
    navbarButton:
      "rounded-2xl px-3 py-2 text-neutral-300 transition hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-white/[0.08] data-[active=true]:text-white",
    navbarButtonIcon: "text-neutral-400",
    navbarButtonText: "font-medium",
    profileSection:
      "rounded-[26px] border border-white/10 bg-white/[0.05] p-1 shadow-none",
    profileSectionItemList: "gap-3",
    profileSectionItem: "rounded-[22px] border border-white/8 bg-black/10 px-3 py-3",
    profileSectionHeader: "px-3 pt-3",
    profileSectionTitleText: "text-white",
    profileSectionSubtitleText: "text-neutral-400",
    profileSectionContent: "px-3 pb-3",
    profileSectionPrimaryButton:
      "rounded-2xl border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.1]",
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
      signInForceRedirectUrl={DASHBOARD_PATH}
      signUpForceRedirectUrl={DASHBOARD_PATH}
      signInFallbackRedirectUrl={DASHBOARD_PATH}
      signUpFallbackRedirectUrl={DASHBOARD_PATH}
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
