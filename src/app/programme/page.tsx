"use client"

import { PageTitle } from "@/components/ui/page-title"

export default function ProgrammePage() {
  return (
    <div className="mx-auto w-full p-4 md:p-6">
      <PageTitle
        title={"Programme"}
        subtitle={`An overview of everything that's happening at the event. Currently being compiled.`}
      />
    </div>
  )
}
