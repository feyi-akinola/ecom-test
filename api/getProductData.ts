import rawData from "../data.json";
import { DataObjectSchema, type DataObject } from "./schema";

export async function getProductData(): Promise<DataObject> {
  return DataObjectSchema.parse(rawData);
}