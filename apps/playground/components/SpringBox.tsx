"use client"

import { spring } from "motion"
import { useState } from "react"
import { Button } from "@arthurreira/ui/components/button"
export default function CSSGeneration() {
    const [state, setState] = useState(false)

    return (
        <div className="example-container w-[500px] h-[460px] bg-gray-100 rounded-lg">
            <div className="box" data-state={state} />
            <Button variant="default" onClick={() => setState(!state)}>Toggle position</Button>

            <style>
                {`
                    .example-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                    }

                    .example-container .box {
                        width: 100px;
                        height: 100px;
                        background-color: var(--primary);
                        border-radius: 10px;
                        transition: transform ${spring(0.5, 0.8)};
transform: skewX(40deg);         /* skewed */
                    }

                    .example-container .box[data-state="true"] {
transform: translateX(100px) rotate(180deg) scale(1.2);
                    }

                    
                `}
            </style>
        </div>
    )
}
