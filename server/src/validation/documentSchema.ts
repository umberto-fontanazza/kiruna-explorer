import { z } from "zod";

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
});
