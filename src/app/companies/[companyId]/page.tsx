import { CompanyProfileView } from "@/app/companies/[companyId]/company-profile-view"
import { MissingText } from "@/components/ui/messages/missing-text"
import { type WithUrlParams } from "@/lib/next-app.types"
import { api } from "@/trpc/server"

export type CompanyProfileProps = {
  companyId: string
}

export default async function CompanyProfile({
  params,
}: WithUrlParams<CompanyProfileProps>) {
  const profile = await api.company.get.query({
    companyId: params.companyId,
  })

  if (!profile) {
    return <MissingText text={"profile not found"} />
  }

  return (
    <div className="w-[100%] p-4 md:flex md:space-x-10 md:p-6">
      <CompanyProfileView profile={profile} />
    </div>
  )
}
