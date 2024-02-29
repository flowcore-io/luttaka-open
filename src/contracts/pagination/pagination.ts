import {z} from "zod";

export const PaginationDto = z.object({
  page: z.number().int().gt(0),
  pageSize: z.number().int().positive().max(1000),
});

export const PaginationInput = PaginationDto.pick({
  page: true,
  pageSize: true
})

export const PaginationResult = PaginationDto;
