import { z } from "zod"

import { webhookFactory } from "@/lib/webhook"

export const company = {
  flowType: "company.0",
  eventType: {
    created: "company.created.0",
    updated: "company.updated.0",
    archived: "company.archived.0",
  },
} as const

export const CompanyEventCreatedPayload = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  ownerId: z.string(),
  companyType: z.string().optional(),
})

export const CompanyEventUpdatedPayload = CompanyEventCreatedPayload.pick({
  id: true,
  name: true,
  imageUrl: true,
  description: true,
  ownerId: true,
  companyType: true,
})
  .partial()
  .required({
    id: true,
  })

export const CompanyEventArchivedPayload = z.object({
  id: z.string(),
  state: z.boolean().optional(),
  _reason: z.string().optional(),
})

export const sendCompanyCreatedEvent = webhookFactory<
  z.infer<typeof CompanyEventCreatedPayload>
>(company.flowType, company.eventType.created)

export const sendCompanyUpdatedEvent = webhookFactory<
  z.infer<typeof CompanyEventUpdatedPayload>
>(company.flowType, company.eventType.updated)

export const sendCompanyArchivedEvent = webhookFactory<
  z.infer<typeof CompanyEventArchivedPayload>
>(company.flowType, company.eventType.archived)
