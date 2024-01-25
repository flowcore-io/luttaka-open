import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const contactRouter = createTRPCRouter({
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.contact.findUnique({
      where: { contactid: input },
    });
  }),
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.contact.findMany({
      orderBy: { validtime: "asc" },
    });
  }),
});
