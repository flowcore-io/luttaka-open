import Link from "next/link"
import React, { type FC } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type CompanyProfile } from "@/contracts/company/company"

export type CompanyListItemProps = {
  company: CompanyProfile
}

export const CompanyListItem: FC<CompanyListItemProps> = ({ company }) => {
  return (
    <Link href={`/companies/${company.id}`}>
      <li
        key={company.id}
        className={"flex items-center space-x-3 border-b border-accent py-3"}>
        <Avatar className={"h-12 w-12 flex-grow-0 rounded-full"}>
          <AvatarImage src={company.imageUrl} alt={company.name} />
          <AvatarFallback className={"rounded"}>
            {company.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className={"flex-1"}>
          <p className={"font-bold"}>{company.name}</p>
          <p className={"font-thin"}>{company.description}</p>
          <p className={"font-thin"}>
            {company.companyType === "sponsor"
              ? "SPONSOR"
              : company.companyType === "exhibitor"
                ? "EXHIBITOR"
                : ""}
          </p>
        </div>
      </li>
    </Link>
  )
}
