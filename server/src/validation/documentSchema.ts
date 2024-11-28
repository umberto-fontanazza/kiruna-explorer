import { z } from "zod";
import { DocumentType, Stakeholder } from "../model/document";
import { ScaleType } from "../model/scale";
import { areaSchema } from "./areaSchema";
import { coordinatesSchema } from "./coordinatesSchema";

export const idRequestParam = z.object({
  id: z.coerce.number().int().positive(),
});

export type Scale = z.infer<typeof scale>;
const scale = z
  .object({
    type: z.nativeEnum(ScaleType),
    ratio: z.number().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.type === ScaleType.ArchitecturalScale &&
      data.ratio === undefined
    ) {
      ctx.addIssue({
        path: ["value"],
        message:
          "scale.value is required when scale.type is 'architectural_scale'",
        code: z.ZodIssueCode.custom,
      });
    }

    if (
      data.type !== ScaleType.ArchitecturalScale &&
      data.ratio !== undefined
    ) {
      ctx.addIssue({
        path: ["ratio"],
        message:
          "scale.ratio should not be defined when scale.type is not 'architectural_scale'",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const getQueryParameters = z
  .object({
    type: z.nativeEnum(DocumentType).optional(),
    scaleType: z.nativeEnum(ScaleType).optional(),
    maxIssuanceDate: z.string().date().optional(),
    minIssuanceDate: z.string().date().optional(),
  })
  .strict();

export type PostBody = z.infer<typeof postBody>;
export const postBody = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    type: z.nativeEnum(DocumentType),
    scale,
    stakeholders: z.array(z.nativeEnum(Stakeholder)).optional(),
    coordinates: coordinatesSchema.optional(),
    area: areaSchema.optional(),
    issuanceDate: z.string().date().optional(),
  })
  .strict()
  .refine((body) => !(body.coordinates && body.area), {
    message: "Either provide coordinates or an area",
  });

export type PatchBody = z.infer<typeof patchBody>;
export const patchBody = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: z.nativeEnum(DocumentType).optional(),
    scale: scale.optional(),
    stakeholders: z.array(z.nativeEnum(Stakeholder)).optional(),
    coordinates: coordinatesSchema.optional(),
    area: areaSchema.optional(),
    issuanceDate: z.string().date().optional(),
  })
  .strict()
  .refine((body) => !(body.coordinates && body.area), {
    message: "Either provide coordinates or an area",
  });
