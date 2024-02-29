import dynamicInport from "next/dynamic"
import { type FC } from "react"
import rehypeSanitize from "rehype-sanitize"

const MDEditor = dynamicInport(() => import("@uiw/react-md-editor"), {
  ssr: false,
})

export type MarkdownEditorProps = {
  name: string
  value: string
  onChange: (input: { target: { value: string; name: string } }) => void
}

export const dynamic = "force-dynamic"

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  name,
  value,
  onChange,
}) => {
  return (
    <MDEditor
      value={value}
      onChange={(changeValue) =>
        onChange({
          target: {
            value: changeValue ?? "",
            name: name,
          },
        })
      }
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
    />
  )
}
