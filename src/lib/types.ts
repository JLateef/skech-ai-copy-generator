export interface ShoeAttributes {
  styleName: string;
  category: string;
  gender: string;
  materials: string;
  comfortTech: string[];
  colorway: string;
  useCase: string;
  priceTier: string;
  targetMarketForLocalization: string;
}

export interface WholesaleCopy {
  headline: string;
  description: string;
  keySellingPoints: string[];
}

export interface DtcCopy {
  title: string;
  body: string;
  bullets: string[];
  seoKeywords: string[];
}

export interface LocalizedCopy {
  market: string;
  language: string;
  description: string;
}

export interface Governance {
  groundedInInputsOnly: boolean;
  unsupportedClaimsRemoved: string[];
  missingAttributes: string[];
  piiDetected: boolean;
}

export interface GenerateResult {
  wholesale: WholesaleCopy;
  dtc: DtcCopy;
  localized: LocalizedCopy;
  governance: Governance;
}

export interface GenerateApiResponse {
  ok: boolean;
  model?: string;
  data?: GenerateResult;
  error?: string;
}

export const COMFORT_TECH_OPTIONS = [
  "Air-Cooled Memory Foam",
  "Skechers Slip-ins hands-free",
  "Arch Fit",
  "Hyper Burst",
] as const;

export const CATEGORY_OPTIONS = [
  "Lifestyle Sneaker",
  "Walking Shoe",
  "Performance Runner",
  "Sandal",
  "Slip-On",
  "Boot",
] as const;

export const GENDER_OPTIONS = ["Men's", "Women's", "Kids'", "Unisex"] as const;

export const PRICE_TIER_OPTIONS = ["Value ($)", "Mid ($$)", "Premium ($$$)"] as const;

export const LOCALIZATION_MARKET_OPTIONS = [
  "Japan / ja",
  "Germany / de",
  "Mexico / es-MX",
  "France / fr",
] as const;
