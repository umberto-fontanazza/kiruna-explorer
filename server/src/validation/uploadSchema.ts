import { z } from "zod";
import { UploadType } from "../model/upload";

export type PostBody = z.infer<typeof postBody>;
export const postBody = z
  .object({
    title: z.string(),
    type: z.nativeEnum(UploadType),
    documentIds: z.array(z.number().min(1)).nonempty(),
    file: z.string(),
  })
  .strict();
