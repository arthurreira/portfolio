"use client"

import { Children, isValidElement, cloneElement, type ReactNode } from "react"
import { motion } from "motion/react"

/**
 * Fades each word in as it arrives.
 *
 * Block-level animation does not work for streaming: a CSS or motion entrance
 * fires when an element mounts, but streamed text accumulates *inside* an
 * existing paragraph that never remounts. Only a brand-new block would animate,
 * and most answers are one or two paragraphs — so the text simply snapped in.
 *
 * Splitting to words gives each new one its own mount. React reconciles by
 * position, so words already on screen keep their identity and stay put while
 * only the newly arrived ones fade. The final word re-renders as it grows
 * character by character, which is why it animates once on appearance rather
 * than on every keystroke of the stream.
 */
const WORD_MOTION = {
  initial: { opacity: 0, filter: "blur(3px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  transition: { duration: 0.24, ease: "easeOut" as const },
}

/** Words are inline-block so the blur has a box; spaces stay plain text so
 *  lines still wrap between words and never inside one. */
const animateString = (text: string, keyPrefix: string): ReactNode[] =>
  text
    .split(/(\s+)/)
    .map((part, index) =>
      part === "" || /^\s+$/.test(part) ? (
        part
      ) : (
        <motion.span
          key={`${keyPrefix}-${index}`}
          {...WORD_MOTION}
          className="inline-block"
        >
          {part}
        </motion.span>
      )
    )

/**
 * Walks the rendered markdown and animates the text inside it, leaving the
 * element structure alone — so bold, links and list markup keep working.
 */
export function StreamedWords({
  children,
  keyPrefix = "w",
}: {
  children: ReactNode
  keyPrefix?: string
}): ReactNode {
  return Children.map(children, (child, index) => {
    if (typeof child === "string") {
      return animateString(child, `${keyPrefix}-${index}`)
    }

    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(child, {
        children: (
          <StreamedWords keyPrefix={`${keyPrefix}-${index}`}>
            {child.props.children}
          </StreamedWords>
        ),
      })
    }

    return child
  })
}
