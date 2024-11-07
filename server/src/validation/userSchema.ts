import { z } from "zod";
import { UserRole } from "../model/user";

export type PostBody = z.infer<typeof postBody>;
export const postBody = z
  .object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    surname: z.string(),
    role: z.nativeEnum(UserRole),
  })
  .strict();
