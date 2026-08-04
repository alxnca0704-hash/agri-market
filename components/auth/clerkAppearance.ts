import type { ClerkAppearanceTheme } from "@clerk/shared/types";

const base: ClerkAppearanceTheme = {
  options: {
    logoPlacement: "none",
  },
  variables: {
    colorPrimary: "#3e6b4d",
    colorPrimaryForeground: "#ffffff",
    colorForeground: "#262320",
    colorMuted: "#f2f0ed",
    colorMutedForeground: "#56504a",
    colorBackground: "#fbfaf8",
    colorInput: "#ffffff",
    colorInputForeground: "#262320",
    colorBorder: "#e7e4df",
    borderRadius: "0.625rem",
    fontFamily:
      "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
  },
};

export const authAppearance: ClerkAppearanceTheme = {
  ...base,
  elements: {
    rootBox: "w-full",
    card: "w-full shadow-soft",
    formFieldInput: "text-base",
    formButtonPrimary: "min-h-11",
    socialButtonsBlockButton: "min-h-11",
    footerAction: "flex-wrap",
  },
};

export const profileAppearance: ClerkAppearanceTheme = {
  ...base,
  elements: {
    rootBox: "w-full",
    card: "w-full",
    pageScrollBox: "p-4 sm:p-6",
    buttonPrimary: "min-h-11",
    avatarImage: "size-16 sm:size-20",
  },
};
