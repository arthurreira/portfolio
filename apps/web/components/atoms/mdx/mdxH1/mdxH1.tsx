import type { MdxH1Props } from './mdxH1Props'

export function MdxH1({ children, ...props }: MdxH1Props) {
  return (
    <h1 className="text-3xl font-bold mb-4" {...props}>
      {children}
    </h1>
  )
}