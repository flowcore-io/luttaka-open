import { type FC } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type ConferencePreview } from "@/contracts/conference/conference"
import { preventDefaultOnReference } from "@/lib/events/prevent-default-on-reference"

export type ConferenceSelectionProps = {
  conferences: ConferencePreview[]
  onSelect: (conferenceId: string) => void
}

export const ConferenceSelection: FC<ConferenceSelectionProps> = (props) => {
  return (
    <Select onValueChange={props.onSelect}>
      <SelectTrigger>
        <SelectValue placeholder={"Conferences you have tickets for"} />
      </SelectTrigger>
      <SelectContent ref={preventDefaultOnReference}>
        {props.conferences.map((conference) => (
          <SelectItem key={conference.id} value={conference.id}>
            {conference.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
