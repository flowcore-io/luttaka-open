import z from "zod";
import {PaginationResult} from "@/contracts/pagination/pagination";
import {UserProfileDto} from "@/contracts/profile/user-profile";

export const PagedProfilesDto = PaginationResult.extend({
  items: z.array(UserProfileDto)
});

export type PagedProfileResult = z.infer<typeof PagedProfilesDto>;


