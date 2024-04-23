import { type FC } from "react"

import { Button } from "@/components/ui/button"
import { type SelectorControls } from "@/hooks/use-selector"

export type SelectAllControllerProps = {
  selector: SelectorControls
}

export const SelectAllController: FC<SelectAllControllerProps> = ({
  selector,
}) => {
  return (
    <Button variant={"link"} onClick={selector.toggleAllSelections}>
      {selector.hasSelections ? "Deselect All" : "Select All"}
    </Button>
  )
}
