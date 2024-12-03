import { z } from "zod";
import { polygonSchema } from "./polygonSchema";

export type AreaBody = z.infer<typeof areaSchema>;
export const areaSchema = z
  .object({
    include: polygonSchema,
    exclude: z.array(polygonSchema),
  })
  .strict();
