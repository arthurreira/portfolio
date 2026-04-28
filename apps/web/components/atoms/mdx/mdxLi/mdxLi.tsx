import type { MdxLiProps } from './mdxLiProps'

export function MdxLi({ children, ...props }: MdxLiProps) {
  return (
    <li className="text-muted-foreground" {...props}>
      {children}
    </li>
  )
}