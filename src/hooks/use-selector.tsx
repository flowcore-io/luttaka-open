import { useCallback, useMemo, useState } from "react"

export type SelectorControls = {
  toggleAllSelections: () => void
  select: (selected: boolean, key: string) => void
  deselectAll: () => void
  isSelected: (key: string) => boolean
  hasSelections: boolean
  selections: string[]
}

export type SelectorOptions = {
  onSelectAll: () => string[]
  onRemoveFilter: (key: string, input: string) => boolean
}

// todo: make the selection-set generic (not just string)
export function useSelector(options: SelectorOptions): SelectorControls {
  const [selections, setSelections] = useState<string[]>([])
  const hasSelections = useMemo(() => selections.length > 0, [selections])

  const toggleAllSelections = useCallback(() => {
    if (selections.length > 0) {
      setSelections([])
      return
    }

    setSelections(options.onSelectAll())
  }, [selections])

  const select = useCallback(
    (selected: boolean, id: string) => {
      if (!id) {
        return
      }

      if (!selected) {
        setSelections(
          selections.filter((existingId) =>
            options.onRemoveFilter(existingId, id),
          ),
        )
        return
      }

      if (selections.includes(id)) {
        return
      }

      setSelections([...selections, id])
    },
    [selections],
  )

  const deselectAll = useCallback(() => {
    setSelections([])
  }, [selections])

  const isSelected = useCallback(
    (key: string) => selections.includes(key),
    [selections],
  )

  return {
    toggleAllSelections,
    select,
    deselectAll,
    isSelected,
    hasSelections,
    selections,
  }
}
