import type { MdxH2Props } from './mdxH2Props'

export function MdxH2({ children, ...props }: MdxH2Props) {
  return (
    <h2 className="text-xl font-semibold mt-8 mb-4" {...props}>
      {children}
    </h2>
  )
}
