import { z } from "zod";
import { LinkType } from "../model/link";

export type PutBody = z.infer<typeof putBody>;
export const putBody = z.object({
  targetDocumentId: z.number().min(1),
  linkTypes: z.array(z.nativeEnum(LinkType)),
});
