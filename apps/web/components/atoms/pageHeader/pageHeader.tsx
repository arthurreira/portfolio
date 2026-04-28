import { PageHeaderProps } from './pageHeaderProps'



export function PageHeader({ title }: PageHeaderProps) {
    return (
        <>
            <h1 className="scroll-m-20 font-extrabold tracking-tight text-balance mb-4">
                {title}
            </h1>
        </>
    )
}