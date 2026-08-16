export type StudioPalette = {
  sage: string;
  sageSoft: string;
  bronze: string;
  linen: string;
  ink: string;
  key: string;
  fill: string;
};

export const LIGHT_PALETTE: StudioPalette = {
  sage: "#5A6B4E",
  sageSoft: "#8A9A7A",
  bronze: "#A89070",
  linen: "#D0C4B0",
  ink: "#3F3A33",
  key: "#F3EEE6",
  fill: "#B4C0A8",
};

export const DARK_PALETTE: StudioPalette = {
  sage: "#8A9A7A",
  sageSoft: "#B4C0A8",
  bronze: "#C4A882",
  linen: "#5C564C",
  ink: "#E2D8C8",
  key: "#EFE8DC",
  fill: "#6F8260",
};

export type StudioMode = "desktop" | "mobile" | "static";
