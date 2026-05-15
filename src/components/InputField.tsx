'use client'

import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"

export interface AxiomInputRef {
    clear: () => void
}

interface InputProps {
    id?: string
    name?: string
    className?: string // Handles width, height, margins via Tailwind
    placeholder?: string
    autoComplete?: string
    // Colors
    activeColor?: string
    baseColor?: string
    placeholderColor?: string // Default to lighter version of baseColor 
    borderColor?: string
    backgroundColor?: string
    backgroundColorTransparency?: number
    spotlightColor?: string
    errorColor?: string
    // Features
    enableTilt?: boolean
    maxTilt?: number
    perspective?: number
    enableSpotlight?: boolean
    onBlur?: (value: string) => void
    onChange?: (value: string) => void
    error?: string
    disabled?: boolean
    // font family, weight, size
}

export const InputField = forwardRef<AxiomInputRef, InputProps>(({
    id = "axiom-input",
    name = "input",
    className = "w-100 h-10",
    placeholder = "Enter value...",
    autoComplete = "email",
    activeColor = "#1d4ed8",
    baseColor = "#0f172a",
    placeholderColor = "#94a3b8",
    borderColor = "#e2e8f0",
    backgroundColor = "#ffffff",
    backgroundColorTransparency = 60,
    spotlightColor = "#6366f1",
    errorColor = "#ef4444",
    enableTilt = true,
    maxTilt = 8,
    perspective = 1200,
    enableSpotlight = true,
    onBlur,
    onChange,
    error,
    disabled = false
}, ref) => {
    const sensorRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    
    const [isFocused, setIsFocused] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const [remountKey, setRemountKey] = useState(0)
    const [capturedInput, setCapturedInput] = useState("")

    useImperativeHandle(ref, () => ({
        clear: () => {
            setCapturedInput(""); // Clear internal state
            if (onChange) onChange("")
        }
    }))

    const hasData = capturedInput.length > 0
    const isSpotlightActive = !isFocused && isHovered
    const showSpotlight = isSpotlightActive && enableSpotlight

    const textColor = hasData ? baseColor : placeholderColor
    const activeBorderColor = error ? errorColor : borderColor
    const activeFillColor = error? errorColor : (showSpotlight ? 'transparent' : (isFocused ? activeColor : textColor))

    const getRgba = (hex: string, opacity: number) => {
        // Strip the '#' if it exists
        const cleanHex = hex.replace('#', '');
        // Parse the hex string into Red, Green, Blue integers
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        // Convert 60 to 0.6
        const alpha = opacity / 100;
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const activeSpotlightColor = error ? getRgba(errorColor, 10) : getRgba(spotlightColor, 15)
    const bgRgba = getRgba(backgroundColor, backgroundColorTransparency)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!sensorRef.current || !cardRef.current) return
        if (isFocused) return // Disable spotlight when field is selected

        // Get dimensions and screen position of component
        const rect = sensorRef.current.getBoundingClientRect()
        
        // Calculate cursor position relative to top left corner of component
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Inject variables directly into CSS styles for instant updates
        cardRef.current.style.setProperty('--mx', `${x}px`)
        cardRef.current.style.setProperty('--my', `${y}px`)

        if (!enableTilt) return
        
        // Centre of component
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -maxTilt // Vertical mouse movement causes rotation around X axis
        const rotateY = ((x - centerX) / centerX) * maxTilt // Horizontal mouse movement causes rotation around Y axis

        cardRef.current.style.setProperty('--rx', `${rotateX}deg`)
        cardRef.current.style.setProperty('--ry', `${rotateY}deg`)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
        // Turn off transitions for immediate updates
        if (cardRef.current) cardRef.current.style.transition = 'none'
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (!cardRef.current) return
        if (isFocused) return

        // Smooth transition to default state when no longer hovered
        cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
        // Called before the next repaint of the screen
        // Ensures transition property is updated before applying rotation changes
        requestAnimationFrame(() => {
            if (!cardRef.current) return
            cardRef.current.style.setProperty('--rx', `0deg`)
            cardRef.current.style.setProperty('--ry', `0deg`)
        })
    }

    const handleFocus = () => {
        setIsFocused(true)
        if (!cardRef.current) return
        
        // Apply smooth transition to default state when field is selected
        cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        cardRef.current.style.setProperty('--rx', `0deg`)
        cardRef.current.style.setProperty('--ry', `0deg`)
    }

    const handleAnimationStart = (e: React.AnimationEvent<HTMLInputElement>) => {
        // Check that the animation started is the one we are looking for and that the input field exists
        if (e.animationName === 'onAutoFillStart' && inputRef.current) {
            // Extract the autofilled email and update React's state
            const injectedValue = inputRef.current.value

            setCapturedInput(injectedValue)
            if (onChange) onChange(capturedInput)

            setIsFocused(false) // Automatically click away after autofill

            setRemountKey(prev => prev + 1) // Update the remount key to trigge a rerender
        }
    }

    const dynamicStyles = {
        '--fill-color': activeFillColor,
        '--bg-clip': error ? 'initial' : (showSpotlight ? 'text' : 'initial'),
        '--bg-image': error
                ? 'none'
                : (showSpotlight
                    ? `radial-gradient(circle 120px at var(--mx, 50%) var(--my, 50%), ${activeColor}, ${textColor})` 
                    : 'none'),
        color: isFocused && !error ? activeColor : (error ? errorColor : textColor), // Fallback
        backgroundImage: 'var(--bg-image)',
        WebkitBackgroundClip: 'var(--bg-clip)',
        WebkitTextFillColor: 'var(--fill-color)',
    } as React.CSSProperties

    return (
        <div
            ref={sensorRef}
            style={{ perspective: `${perspective}px` }}
            className={`relative ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <style>{// Updates the style when autofill is used
            `
                @keyframes onAutoFillStart { from {} to {} }
                
                .axiom-autofill-override:-webkit-autofill {
                    animation-name: onAutoFillStart; /* Start an empty animation when autofill is applied */
                    -webkit-text-fill-color: ${activeColor} !important;
                    background-color: transparent !important;
                }

                .axiom-autofill-override:-internal-autofill-previewed,
                .axiom-autofill-override:-internal-autofill-selected {
                    -webkit-text-fill-color: ${baseColor} !important;
                    -webkit-background-clip: initial !important;
                    background-image: none !important;
                    background-color: transparent !important;
                    /* Delays the browser's attempt to update the background color by 14 hours so it stays transparent */
                    transition: background-color 50000s ease-in-out 0s !important;
                }
            `}
            </style>
            <div 
                ref={cardRef}
                className={`w-full h-full relative rounded-xl border backdrop-blur-xl shadow-lg overflow-hidden`}
                style={{ 
                    borderColor: activeBorderColor,
                    backgroundColor: bgRgba,
                    transform: isFocused ? 'none' : 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
                    transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                { showSpotlight && (
                    <div 
                        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                        style={{
                            background: `radial-gradient(circle 240px at var(--mx, 50%) var(--my, 50%), ${activeSpotlightColor}, transparent 80%)`,
                        }}
                    />
                )}

                <input
                    key={remountKey}
                    ref={inputRef}
                    id={id}
                    name={name}
                    autoComplete={autoComplete}
                    placeholder={isFocused ? "" : placeholder}
                    disabled={disabled}
                    onFocus={handleFocus}
                    onBlur={() => {
                        setIsFocused(false)
                        if (onBlur) onBlur(capturedInput)
                    }}
                    value={capturedInput}
                    onChange={(e) => {
                        const currentValue = e.target.value
                        setCapturedInput(currentValue)
                        if (onChange) onChange(currentValue)
                    }}
                    onAnimationStart={handleAnimationStart}
                    className="axiom-autofill-override w-full h-full bg-transparent px-6 text-center focus:outline-none"
                    style={dynamicStyles}
                />
            </div>
            {error && (
                <div
                    className="absolute -bottom-5 left-2 text-xs font-medium"
                    style={{ color: errorColor }}
                >
                    {error}
                </div> // Tilt with card without overflowing
            )}
        </div>
    )
})

InputField.displayName = "InputField"
