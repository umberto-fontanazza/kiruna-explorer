import { z } from "zod";

export type PostBody = z.infer<typeof postBody>;
export const postBody = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();
