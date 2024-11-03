import { z } from "zod";

export type Coordinates = z.infer<typeof coordinates>;
const coordinates = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .optional();

export const idRequestParam = z.object({
  id: z.coerce.number().min(1),
});

export type PostBody = z.infer<typeof postBody>;
export const postBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export type PatchBody = z.infer<typeof patchBody>;
export const patchBody = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  coordinates,
});
