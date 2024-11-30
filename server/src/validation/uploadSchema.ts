import { z } from "zod";
import { UploadType } from "../model/upload";

export const idRequestParam = z
  .object({
    id: z.coerce.number().int().positive(),
  })
  .strict();

export type PostBody = z.infer<typeof postBody>;
export const postBody = z
  .object({
    title: z.string(),
    type: z.nativeEnum(UploadType),
    documentIds: z.array(z.number().min(1)).nonempty().optional(),
    file: z.string(),
  })
  .strict();

export type GetManyQueryParameters = z.infer<typeof getManyQueryParameters>;
export const getManyQueryParameters = z
  .object({
    documentId: z.coerce.number().int().positive(),
    file: z.literal("omit").or(z.literal("include")).optional(),
  })
  .strict();

//TODO: refine at least one field must be defined
//TODO: refine intersection of ids in bind and decouple must be empty
export type PatchBody = z.infer<typeof patchBody>;
export const patchBody = z.object({
  title: z.string().optional(),
  bindDocumentIds: z.array(z.number().int().positive()).nonempty().optional(),
  decoupleDocumentIds: z
    .array(z.number().int().positive())
    .nonempty()
    .optional(),
});

export type GetQueryParameters = z.infer<typeof getQueryParameters>;
/** WARNING for GET /uploads/:id ONLY, don't use without :id */
export const getQueryParameters = z
  .object({
    bindedDocumentIds: z.literal("omit").or(z.literal("include")).optional(),
  })
  .optional();
