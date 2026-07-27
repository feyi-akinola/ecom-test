import { z } from "zod";

export const ProductItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  options: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      image: z.string().nullable()
    })
  ).nullable(),
  price: z.number(),
  discountedPrice: z.number().nullable(),
  image: z.string().nullable(),
});

export const DataObjectSchema = z.object({
  cameras: z.array(ProductItemSchema),
  sensors: z.array(ProductItemSchema),
  plans: z.array(ProductItemSchema),
  protection: z.array(ProductItemSchema),
});

export type ProductItem = z.infer<typeof ProductItemSchema>;
export type DataObject = z.infer<typeof DataObjectSchema>;