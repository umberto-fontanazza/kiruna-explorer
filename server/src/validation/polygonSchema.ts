import { z } from "zod";
import { coordinatesSchema } from "./coordinatesSchema";

export type PolygonBody = z.infer<typeof polygonSchema>;
export const polygonSchema = z.array(coordinatesSchema).min(3);
