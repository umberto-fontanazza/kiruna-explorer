import { z } from "zod";

export type Coordinates = z.infer<typeof coordinatesSchema>;
export const coordinatesSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();
