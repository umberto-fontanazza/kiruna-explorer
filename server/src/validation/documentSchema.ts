import { z } from "zod";
import { DocumentType, Stakeholder } from "../model/document";
import { ScaleType } from "../model/scale";

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

export type Scale = z.infer<typeof scale>;
const scale = z.object({
  type: z.nativeEnum(ScaleType),
  ratio: z.number().optional(), //TODO: refine
});

export type PostBody = z.infer<typeof postBody>;
export const postBody = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    type: z.nativeEnum(DocumentType),
    scale,
    stakeholders: z.array(z.nativeEnum(Stakeholder)).optional(),
    coordinates: coordinates.optional(),
    issuanceDate: z.string().date().optional(),
  })
  .strict();

export type PatchBody = z.infer<typeof patchBody>;
export const patchBody = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: z.nativeEnum(DocumentType).optional(),
    scale: scale.optional(),
    stakeholders: z.array(z.nativeEnum(Stakeholder)).optional(),
    coordinates: coordinates.optional(),
    issuanceDate: z.string().date().optional(),
  })
  .strict();
