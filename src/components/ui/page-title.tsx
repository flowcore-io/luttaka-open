import React from "react";
import {cn} from "@/lib/utils";

export type HeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
}

export const PageTitle = ({title, subtitle, className}: HeaderProps) => {
  return (
    <div className={cn("mt-2, mb-4", className)}>
      <h1 className={"font-bold text-4xl"}>{title}</h1>
      <h2>{subtitle}</h2>
    </div>
  );
}
