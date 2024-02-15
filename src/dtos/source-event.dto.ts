import {z} from "zod"; 

export const SourceEventDto = z.object({
  eventId: z.string(),
  validTime: z.string(),
  payload: z.any(),
});
