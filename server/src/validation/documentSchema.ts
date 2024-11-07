import { z } from "zod";
import { DocumentType } from "../model/document";

export type Coordinates = z.infer<typeof coordinates>;
const coordinates = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();

export const idRequestParam = z.object({
  id: z.coerce.number().min(1),
});

export type PostBody = z.infer<typeof postBody>;
export const postBody = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    coordinates: coordinates,
    type: z.nativeEnum(DocumentType),
  })
  .strict();

export type PatchBody = z.infer<typeof patchBody>;
export const patchBody = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    coordinates: coordinates.optional(),
    type: z.nativeEnum(DocumentType).optional(),
  })
  .strict();
