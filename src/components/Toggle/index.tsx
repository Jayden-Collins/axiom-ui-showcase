'use client'

import { useSyncExternalStore } from "react"
import { CarvedToggle, type CarvedToggleProps } from "./CarvedToggle"

const emptySubscribe = () => () => {}

export const Toggle = (props: CarvedToggleProps) => {
    const isMounted = useSyncExternalStore(
        emptySubscribe,
        () => true, // Client: always true
        () => false // Server: Always false
    )

    if (!isMounted) {
        return <div />
    }

    return (
        <CarvedToggle {...props}/>
    )
}
