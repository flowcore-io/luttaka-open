import { CompanyProfileView } from "@/app/company/[companyId]/company-profile-view"
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
    return <div>Profile not found</div>
  }

  return (
    <div className={"w-[100%] md:flex md:space-x-10"}>
      <CompanyProfileView profile={profile} />
    </div>
  )
}
