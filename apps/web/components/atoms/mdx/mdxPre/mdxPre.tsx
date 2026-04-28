import type { MdxPreProps } from './mdxPreProps'

export function MdxPre({ children, ...props }: MdxPreProps) {
	return (
		<pre className="mb-4 overflow-x-auto rounded-md border p-4" {...props}>
			{children}
		</pre>
	)
}
