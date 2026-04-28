import type { MdxUlProps } from './mdxUlProps'

export function MdxUl({ children, ...props }: MdxUlProps) {
  return (
    <ul className="list-disc pl-6 mb-4 space-y-2" {...props}>
      {children}
    </ul>
  )
}