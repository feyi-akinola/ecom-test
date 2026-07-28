import data from "../data.json";
import { getCartKey } from "./cartKey";
import type { DataObject, ProductItem } from "../api/schema";

const typedData = data as DataObject;

function findProduct(name: string): ProductItem | undefined {
  const all = [
    ...typedData.cameras, 
    ...typedData.sensors, 
    ...typedData.plans, 
    ...typedData.protection
];
  return all.find((p) => p.name === name);
}

function buildInitialState() {
  const seeds: { name: string; optionName?: string; quantity: number }[] = [
    { name: "Wyze Cam v4", optionName: "White", quantity: 1 },
    { name: "Wyze Cam Pan v3", optionName: "White", quantity: 2 },
    { name: "Wyze Sense Motion Sensor", quantity: 2 },
    { name: "Wyze Sense Hub (Required)", quantity: 1 },
    { name: "Cam Unlimited", quantity: 1 },
    { name: "Wyze MicroSD Card (256GB)", quantity: 1 },
  ];

  const quantities: Record<string, number> = {};
  const selectedOptions: Record<string, string | null> = {};

  for (const seed of seeds) {
    const product = findProduct(seed.name);
    if (!product) {
      console.warn(`Seed skipped — no product named "${seed.name}" found in data.json`);
      continue;
    }
    const option = seed.optionName
      ? product.options?.find((o) => o.name === seed.optionName)
      : null;

    if (seed.optionName && !option) {
      console.warn(`Seed skipped — "${product.name}" has no option named "${seed.optionName}"`);
      continue;
    }

    quantities[getCartKey(product.id, option?.id ?? null)] = seed.quantity;
    if (option) selectedOptions[product.id] = option.id;
  }

  return { quantities, selectedOptions };
}

export const {
  quantities: initialQuantities,
  selectedOptions: initialSelectedOptions
} = buildInitialState();