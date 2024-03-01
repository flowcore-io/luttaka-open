import companyArchived from "@/app/api/transform/company.0/route-company-archived"
import companyCreated from "@/app/api/transform/company.0/route-company-created"
import companyUpdated from "@/app/api/transform/company.0/route-company-updated"
import { company } from "@/contracts/events/company"
import EventTransformer from "@/lib/event-transformer"

const eventTransformer = new EventTransformer(company, {
  created: companyCreated,
  updated: companyUpdated,
  archived: companyArchived,
})

export const POST = eventTransformer.post.bind(eventTransformer)
