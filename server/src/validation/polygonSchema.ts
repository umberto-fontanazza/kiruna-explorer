import { z } from "zod";
import { coordinatesSchema } from "./documentSchema";

export type PolygonBody = z.infer<typeof polygonSchema>;
export const polygonSchema = z.array(coordinatesSchema).min(3);
