import type { MdxCodeProps } from './mdxCodeProps'

export function MdxCode({ children, ...props }: MdxCodeProps) {
  return (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  )
}