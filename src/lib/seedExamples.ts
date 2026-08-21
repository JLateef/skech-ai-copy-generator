import type { ShoeAttributes } from "@/lib/types";

// Illustrative examples only -- not real Skechers SKUs. These exist so the
// demo is populated and generating on first load, with no typing required.
export interface SeedExample {
  label: string;
  attrs: ShoeAttributes;
}

export const SEED_EXAMPLES: SeedExample[] = [
  {
    label: "Slip-ins Lifestyle Sneaker",
    attrs: {
      styleName: "Glide Step Slip-ins — Arbor Trail",
      category: "Lifestyle Sneaker",
      gender: "Men's",
      materials: "Engineered mesh upper, synthetic overlays, rubber outsole",
      comfortTech: ["Skechers Slip-ins hands-free", "Air-Cooled Memory Foam"],
      colorway: "Charcoal / Lime",
      useCase: "Everyday casual wear, easy hands-free on-off",
      priceTier: "Mid ($$)",
      targetMarketForLocalization: "Japan / ja",
    },
  },
  {
    label: "Arch Fit Walking Shoe",
    attrs: {
      styleName: "Arch Fit Comfort Walk — Summit Line",
      category: "Walking Shoe",
      gender: "Women's",
      materials: "Knit mesh upper, podiatrist-certified insole, flexible rubber outsole",
      comfortTech: ["Arch Fit", "Air-Cooled Memory Foam"],
      colorway: "Navy / White",
      useCase: "All-day standing and walking, retail and service jobs",
      priceTier: "Mid ($$)",
      targetMarketForLocalization: "Germany / de",
    },
  },
  {
    label: "Hyper Burst Performance Runner",
    attrs: {
      styleName: "Hyper Burst Velocity — Pace Pro",
      category: "Performance Runner",
      gender: "Unisex",
      materials: "Breathable engineered knit upper, lightweight EVA midsole, high-traction rubber outsole",
      comfortTech: ["Hyper Burst"],
      colorway: "Black / Volt",
      useCase: "Road running and high-mileage training",
      priceTier: "Premium ($$$)",
      targetMarketForLocalization: "Mexico / es-MX",
    },
  },
];

export const EMPTY_ATTRS: ShoeAttributes = {
  styleName: "",
  category: "",
  gender: "",
  materials: "",
  comfortTech: [],
  colorway: "",
  useCase: "",
  priceTier: "",
  targetMarketForLocalization: "",
};
