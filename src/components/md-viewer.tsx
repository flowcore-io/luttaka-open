"use client"
import MarkdownView from "@uiw/react-markdown-preview"

import { cn } from "@/lib/utils"

export default function MarkdownViewer({
  source,
  className,
}: {
  source: string
  className?: string
}) {
  return (
    <div className={cn("markdown-body", className)}>
      <MarkdownView source={source} />
    </div>
  )
}
