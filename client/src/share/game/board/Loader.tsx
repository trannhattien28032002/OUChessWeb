import type { FC } from "react"
import React, { useEffect, useState } from "react"

import { useProgress } from "@react-three/drei"

export const Loader: FC = () => {
    const [total, setTotal] = useState(0)
    const { progress } = useProgress()
    useEffect(() => {
        setTotal(progress)
    }, [progress])
    return (
        <>
            {total !== 100 && (
                <div className="loader">
                    <p>Loading {total.toFixed(0)}%</p>
                </div>
            )}
        </>
    )
}
