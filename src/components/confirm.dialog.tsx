import { type ReactNode, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface ConfirmDialogProps {
  children: ReactNode
  title: string
  description: string
  onConfirm: () => Promise<void>
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  return (
    <AlertDialog>
      <AlertDialogTrigger>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={async (e) => {
              setLoading(true)
              e.preventDefault()
              await props.onConfirm()
              setLoading(false)
            }}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
