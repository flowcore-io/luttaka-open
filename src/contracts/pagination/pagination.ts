import {z} from "zod";

export const PaginationDto = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const PaginationInput = PaginationDto.pick({
  page: true,
  pageSize: true
})

export const PaginationResult = PaginationDto;
