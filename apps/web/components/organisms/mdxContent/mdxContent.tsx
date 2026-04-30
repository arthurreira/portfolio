'use client'
import * as runtime from 'react/jsx-runtime'
import { MdxCode, MdxH1, MdxH2, MdxLi, MdxP, MdxPre, MdxUl } from '@/components/atoms/mdx'

const components = {
  h1: MdxH1,
  h2: MdxH2,
  p: MdxP,
  ul: MdxUl,
  li: MdxLi,
  pre: MdxPre,
  code: MdxCode,
}

export function MDXContent({ code }: { code: string }) {
  try {
    const fn = new Function(code)
    const { default: Component } = fn(runtime)
    return <Component components={components} />
  } catch {
    return null
  }
}