import type { MdxPProps } from './mdxPProps'

export function MdxP({ children, ...props }: MdxPProps) {
  return (
    <p className="text-muted-foreground leading-7 mb-4" {...props}>
      {children}
    </p>
  )
}