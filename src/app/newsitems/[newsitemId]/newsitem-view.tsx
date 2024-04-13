"use client"

import Image from "next/image"
import React, { type FC } from "react"

import MarkdownViewer from "@/components/md-viewer"
import { Skeleton } from "@/components/ui/skeleton"
import { type RouterOutputs } from "@/trpc/shared"

export type NewsitemProps = {
  newsitem: RouterOutputs["newsitem"]["get"]
}

export const NewsitemView: FC<NewsitemProps> = ({ newsitem }) => {
  if (!newsitem) {
    console.error("No newsitem found")
    return null
  }

  return (
    <div className={`md:flex md:space-x-4`}>
      <div>
        <div className={`mt-2 text-left`}>
          {newsitem.imageBase64 ? (
            <Image
              src={newsitem.imageBase64}
              alt={newsitem.title}
              className="rounded-xl"
              width={250}
              height={250}
            />
          ) : (
            <Skeleton className="h-[250px] w-[250px] rounded-xl" />
          )}
          <div className={`flex flex-row`}>
            <h1 className={`text-4xl font-bold`}>{newsitem.title}</h1>
          </div>
          {newsitem.introText && (
            <div>
              <MarkdownViewer source={newsitem.introText} className={`mt-2`} />
            </div>
          )}
          {newsitem.fullText && (
            <div>
              <MarkdownViewer source={newsitem.fullText} className={`mt-2`} />
            </div>
          )}
        </div>
        <div className={`mt-4 text-slate-400`}>
          Published:{" "}
          {new Date(newsitem.publishedAt ?? "").toLocaleString("fo-FO", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
      </div>
    </div>
  )
}
