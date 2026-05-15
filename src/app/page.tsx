'use client'

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AxiomButton } from "@/components/Button";
import { AxiomInputRef, InputField } from "@/components/InputField"
import { ArrowDown, ChevronDown, ClipboardCheck, Copy, RotateCcw, X, Zap } from "lucide-react";
import z from "zod";
import { Toggle } from "@/components/Toggle";
import posthog from "posthog-js";
import Image from "next/image";

interface ButtonControlProps {
    label: string,
    buttonColor: string,
    textOffColor: string,
    textOnColor: string,
    width: number,
    height: number,
    radius: number,
    travelDistance: number
}

const emailSchema = z.email({ message: "Please enter a valid email address." })

export default function LandingPage() {
    const [ isStarted, setIsStarted ] = useState(false)
    const [ isEngineReady, setIsEngineReady ] = useState(false)

    const [ showExportDialog, setShowExportDialog ] = useState(false)

    const [ waitlistEmail, setWaitlistEmail ] = useState("")
    const [ emailError, setEmailError ] = useState<string | undefined>(undefined)

    const isMobile = useMediaQuery("(max-width: 768px)") // Checks whether screen width is lower than "md"
    const inputRef = useRef<AxiomInputRef>(null)

    const [controls, setControls] = useState<ButtonControlProps>({
        label: "Click \nHere",
        buttonColor: "#9834c7",
        textOffColor: "#ffffff",
        textOnColor: "#f4eaf9",
        width: 3,
        height: 1,
        radius: 0.5,
        travelDistance: 0.4
    })

    const updateControl = (key: keyof typeof controls, value: string | number) => {
        setControls(prev => ({ ...prev, [key]: value}))
    }

    const resetControls = () => {
        setControls({
            label: "Click \nHere",
            buttonColor: "#9834c7",
            textOffColor: "#ffffff",
            textOnColor: "#f4eaf9",
            width: 3,
            height: 1,
            radius: 0.5,
            travelDistance: 0.4
        })
    }

    const handleJoinWaitlist = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!waitlistEmail) return

        setEmailError(undefined) // Clear stale errors

        const validation = emailSchema.safeParse(waitlistEmail)

        if (!validation.success) {
            setEmailError(validation.error.issues[0].message) // Grab the first issue
            return
        }   
    }

    return (
        <div className={`relative flex flex-col items-center justify-center overflow-x-hidden
            
            ${ isStarted ? 
                "min-h-screen bg-white" : "h-screen overflow-hidden bg-[#280C34]"
            }`}
        >
            {/* Hero Section */}
            <div className="relative w-full h-screen flex flex-col items-center justify-center">
                {!isEngineReady && (
                    <p className="text-4xl font-sans font-bold text-white/10 absolute inset-0 flex items-center justify-center">
                        Rendering scene...
                    </p>
                )}
                <a 
                    href="https://x.com/JaydenxBuilds/status/2055425071561560473" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center bg-zinc-700/70 px-4 py-2 text-sm text-white font-sans hover:bg-zinc-600/70 transition-colors"
                >
                    Axiom UI has officially pivoted to open-source. Read the post-mortem on X ↗️
                </a>
                <div className="flex-[0.8] w-full"></div>
                <div className="w-full h-37.5 md:h-75 flex shrink-0 justify-center">
                    <Toggle
                        active={isStarted}
                        onClick={() => {
                            if (!isStarted) {
                                posthog.capture('hero_toggle_activated')
                            }
                            setIsStarted(!isStarted)
                        }}
                        className="w-75 h-37.5 md:w-150 md:h-75"
                        key={isMobile ? "mobile-toggle" : "desktop-toggle" /* Trigger re-render when resizing */}
                        onReady={() => setIsEngineReady(true)}
                    />
                </div>
                { // Tagline
                    isStarted ? (
                    <div className="flex-[1.2] flex flex-col items-center justify-between gap-2 font-sans text-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black text-black">Copy-paste React 3D UI Elements</h1>
                            <h1 className="text-xl md:text-3xl font-bold text-[#9834c7]">Customizable. Scalable. Fast.</h1>
                        </div>
                        <ArrowDown
                            size={48}
                            color="#9834c7"
                            className="bg-[#9834c7]/10 rounded-full p-1 mb-4"
                        />
                    </div>
                ) : (
                    <div className={`flex-[1.2] items-center ${ isEngineReady ? "opacity-100" : "opacity-0"}`}>
                        <h1 className="text-5xl md:text-8xl font-black font-sans text-white/10">Click</h1>
                    </div>
                )}
            </div>

            {/* Interactive Playground */}
            <div className={`w-full min-h-screen flex items-center justify-center px-8 py-12 transition-colors ${
                isStarted ? "relative opacity-100" : "opacity-0 absolute top-500"
            } transition-colors `}>
                <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-16">
                    {/* Button Preview */}
                    <div className="w-full h-60 lg:h-auto flex flex-col-reverse lg:flex-col items-center justify-center py-2">
                        <div className="w-full h-full flex items-center justify-center">
                            <AxiomButton
                                width={controls.width}
                                height={controls.height}
                                radius={controls.radius}
                                travelDistance={controls.travelDistance}
                                gap={0.2} // Hardcoded to avoid breaking
                                scale={2}
                                label={controls.label}
                                buttonColor={controls.buttonColor}
                                textOffColor={controls.textOffColor}
                                textOnColor={controls.textOnColor}
                                onClick={() => posthog.capture("playground_button_clicked")}
                            />
                        </div>

                        <h3 className="text-4xl md:text-6xl font-extrabold font-sans text-center text-black">
                            Customizable
                            <br/>Components
                        </h3>
                    </div>

                    {/* Export Dialog */}
                    { showExportDialog && (
                        <ExportDialog 
                            controls={controls}
                            onClose={() => setShowExportDialog(false)}
                            onGetPro={() => {
                                setShowExportDialog(false)

                                document.getElementById("early-access-section")?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center"
                                })
                            }}
                        />
                    )}

                    {/* Control Deck */}
                    <div className="px-6 py-4 max-w-xl w-full flex flex-col gap-6 font-sans justify-center rounded-2xl border border-zinc-200 shadow-lg shadow-zinc-300">
                        <p className="text-lg text-center font-bold text-black">Customize Button Appearance</p>

                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            {/* Sliders */}
                            <div className="flex flex-col justify-between gap-4">
                                <div className="flex flex-col gap-4 md:gap-0 justify-between h-full">
                                    <SliderControl
                                        label="Width"
                                        value={controls.width}
                                        min={1}
                                        max={10}
                                        step={0.25}
                                        onChange={(val) => updateControl("width", val)}
                                    />

                                    <SliderControl
                                        label="Height"
                                        value={controls.height}
                                        min={1}
                                        max={4}
                                        step={0.1}
                                        onChange={(val) => updateControl("height", val)}
                                    />

                                    <SliderControl
                                        label="Radius"
                                        value={controls.radius}
                                        min={0}
                                        max={0.5}
                                        step={0.05}
                                        onChange={(val) => updateControl("radius", val)}
                                    />

                                    <SliderControl
                                        label="Travel Distance"
                                        value={controls.travelDistance}
                                        min={0.1}
                                        max={0.8}
                                        step={0.05}
                                        onChange={(val) => updateControl("travelDistance", val)}
                                    />
                                </div>

                                <button
                                    onClick={resetControls}
                                    className="w-full flex flex-row items-center justify-center gap-2 bg-[#9834c7]/10 text-[#9834c7] active:scale-95 transition-all rounded-lg px-4 py-2.5"
                                >
                                    <p className="text-sm font-bold whitespace-nowrap">Reset to Default</p>
                                    <RotateCcw size={20} className="shrink-0"/>
                                </button>
                            </div>
                            
                            {/* Label, Colors, Copy Button */}
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-black">
                                        Label
                                    </label>
                                    <textarea
                                        value={controls.label}
                                        onChange={(e) => updateControl("label", e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9834c7]/50 transition-all resize-none text-black"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-black">
                                        Colors
                                    </label>

                                    <div className="flex flex-row justify-center gap-2 border border-zinc-200 rounded-lg p-2">
                                        <div className="flex flex-col items-center gap-2">
                                            <label className="text-xs font-bold text-black">
                                                Button
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shadow-sm shrink-0">
                                                    <input
                                                        type="color"
                                                        value={controls.buttonColor}
                                                        onChange={(e) => updateControl("buttonColor", e.target.value)}
                                                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <code className="text-xs text-zinc-500 bg-zinc-50 px-2 py-1 rounded border border-zinc-100 uppercase">
                                                {controls.buttonColor}
                                            </code>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            <label className="text-xs font-bold text-black">
                                                Text
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shadow-sm shrink-0">
                                                    <input
                                                        type="color"
                                                        value={controls.textOffColor}
                                                        onChange={(e) => updateControl("textOffColor", e.target.value)}
                                                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <code className="text-xs text-zinc-500 bg-zinc-50 px-2 py-1 rounded border border-zinc-100 uppercase">
                                                {controls.textOffColor}
                                            </code>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            <label className="text-xs font-bold text-black">
                                                Active
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shadow-sm shrink-0">
                                                    <input
                                                        type="color"
                                                        value={controls.textOnColor}
                                                        onChange={(e) => updateControl("textOnColor", e.target.value)}
                                                        className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <code className="text-xs text-zinc-500 bg-zinc-50 px-2 py-1 rounded border border-zinc-100 uppercase">
                                                {controls.textOnColor}
                                            </code>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            posthog.capture('component_export_opened', {
                                                button_color: controls.buttonColor,
                                                width: controls.width,
                                                height: controls.height,
                                            })
                                            setShowExportDialog(true)
                                        }}
                                        disabled={showExportDialog}
                                        className="mt-2 px-4 flex flex-1 items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold rounded-lg transition-all active:scale-95"
                                    >
                                        <Copy/>
                                        Copy TSX Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            { /* Join Waitlist */ }
            <div className={`w-full h-screen flex flex-col items-center justify-center ${
                isStarted ? "relative opacity-100" : "opacity-0 absolute top-500"}`}
            >
                <h3 className="text-4xl md:text-6xl text-center font-black font-sans text-black">
                    Input Validation Sandbox
                </h3>
                <form
                    onSubmit={handleJoinWaitlist}
                    className="w-full flex flex-col items-center gap-16"
                >
                    <InputField
                        ref={inputRef}
                        activeColor="#9834c7"
                        placeholderColor="#d4ace8"
                        placeholder="abc@gmail.com"
                        spotlightColor="#9834c7"
                        className="w-5/6 md:w-1/2 h-10 md:h-14 mt-16 font-sans font-bold text-xl md:text-3xl"
                        onChange={(value: string) => {
                            setWaitlistEmail(value)
                            if (emailError) setEmailError(undefined)
                        }}
                        error={emailError}
                    />
                    <div className="relative w-full h-20 items-center justify-center">
                        <AxiomButton
                            width={5}
                            height={1}
                            radius={0.5}
                            gap={0.15}
                            scale={2.5}
                            onClick={() => handleJoinWaitlist()}
                            label="Validate Email"
                            buttonColor="#9834c7"
                            textOffColor="#ffffff"
                            textOnColor="#f4eaf9"
                        />
                    </div>
                </form>
            </div>

            { /* Star on GitHub */ }
            <div
                id="early-access-section"
                className={`w-full h-screen flex flex-col items-center justify-center gap-8 ${
                    isStarted ? "relative opacity-100" : "opacity-0 absolute top-500"}`}
            >
                <div>
                    <h3 className="text-4xl md:text-6xl text-center font-black font-sans text-black">
                        Axiom UI
                    </h3>
                </div>
                <div className="w-full flex flex-col items-center">
                    <div className="w-full h-20 md:h-30 items-center justify-center">
                        <AxiomButton
                            width={5}
                            height={1}
                            radius={0.5}
                            gap={0.15}
                            scale={ isMobile ? 1.2 : 2.5 }
                            onClick={() => {
                                window.location.href = "https://github.com/Jayden-Collins/axiom-ui-showcase"
                            }}
                            label="Star on GitHub"
                            buttonColor="#9834c7"
                            textOffColor = "#ffffff"
                            textOnColor = "#f4eaf9"
                        />
                    </div>
                    <p className="font-semibold font-sans text-black">
                        Read the <a href="/docs" className="underline text-[#9834c7] font-sans">Docs</a>
                    </p>
                </div>
            </div>
        </div>
    )
} 

function SliderControl({ label, value, min, max, step, onChange } : {
    label: string
    value: number
    min: number
    max: number
    step: number
    onChange: (val: number) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-black">{label}</label>
                <span className="ml-2 text-xs text-zinc-500 font-mono">{value.toFixed(2)}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-[#9834c7] hover:accent-[#9834c7] tarnsition-all"
            />
        </div>
    )
}

export function useMediaQuery(query: string) {
    // 1. Define how React should listen for changes to the browser window
    const subscribe = useCallback(
        (callback: () => void) => {
            const mediaQueryList = window.matchMedia(query);
            mediaQueryList.addEventListener("change", callback);
            return () => mediaQueryList.removeEventListener("change", callback);
        },
        [query]
    );

    // 2. Define how React should get the current value from the browser
    const getSnapshot = useCallback(() => {
        return window.matchMedia(query).matches;
    }, [query]);

    // 3. Define the fallback value for Next.js Server-Side Rendering
    const getServerSnapshot = () => false;

    // React handles the synchronization natively—no useEffect, no cascading renders.
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function ExportDialog({ controls, onClose } : {
    controls: ButtonControlProps
    onClose: () => void
    onGetPro: () => void
}) {
    const usageCode = generateUsageCodeSnippet(controls)

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60">
            <div
                className="w-full flex flex-col max-w-2xl max-h-[90vh] overflow-hidden overflow-y-auto bg-white rounded-2xl shadow-2xl border border-zinc-200"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between sticky top-0 pl-4 pr-2 py-3 bg-white/80 backdrop-blur-md shadow-md">
                    <h1 className="text-2xl font-sans font-black items-center text-black">Export Component</h1>
                    <button
                        onClick={onClose}
                        className="transition-colors"
                    >
                        <X strokeWidth={2} size={32} className="text-zinc-500 hover:text-black active:scale-95"/>
                    </button>
                </div>
                <div className="pl-6 pr-4 py-4 text-black">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex-1 flex-col">
                                <h3 className="font-semibold font-sans mt-2">1. Install Dependencies</h3>
                                <p className="text-sm font-sans">
                                    Run the following commands in the terminal.
                                </p>
                            </div>
                            <CopyButton content={terminalCommand} />
                        </div>
                        <pre
                            className="mt-2 text-xs font-mono text-gray-600 p-2 bg-gray-100 border border-gray-200 rounded-lg overflow-x-auto"
                        >
                            {terminalCommand}
                        </pre>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex-1 flex-col">
                                <h3 className="font-semibold font-sans">2. AxiomButton.tsx</h3>
                                <p className="text-sm font-sans mb-2">
                                    Create a new file named <code
                                        className="bg-zinc-100 px-1 py-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                                    >
                                        AxiomButton.tsx
                                    </code> and paste the following component code.
                                </p>
                            </div>
                            <div className="flex">
                                <CopyButton content={componentCode} />
                            </div>
                        </div>
                        <pre
                            className="mt-2 h-48 text-xs font-mono text-gray-600 p-2 bg-gray-100 border border-gray-200 rounded-lg overflow-x-auto shadow-inner"
                        >
                            {componentCode}
                        </pre>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-col">
                                <h3 className="font-semibold font-sans">3. Usage</h3>
                                <p className="text-sm font-sans mb-2">
                                    Import and render the component in your application.
                                </p>
                            </div>
                            <CopyButton content={usageCode} />
                        </div>
                        <pre className="mt-2 text-xs font-mono text-gray-600 p-2 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
                            {usageCode}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CopyButton({ content } : { content: string }) {
    const [ copied, setCopied ] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content)
        posthog.capture('component_code_copied')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000) // Wait 2 seconds before allowing the user to copy the code again
    }

    return (
        <div>
            <button
                onClick={handleCopy}
                disabled={copied}
                className={`p-2 flex flex-1 items-center justify-center gap-1 ${copied ? "bg-[#9834c7]" : "bg-black"} text-white text-xs rounded-lg transition-all active:scale-95 active:bg-[#9834c7]`}
            >
                { copied ? (
                    <>
                        <ClipboardCheck size={16} />
                        Copied to Clipboard
                    </>
                ) : (
                    <>
                        <Copy size={16} />
                        Copy TSX Code
                    </>
                )}
            </button>
        </div>
    )
}

function generateUsageCodeSnippet({
    label = 'Click',
    buttonColor = '#22c55e',
    textOffColor = "#0a5927",
    textOnColor = "#ffffff",
    width = 3,
    height = 1,
    radius = 0.5,
    travelDistance = 0.4
} : ButtonControlProps ) {
    const labelString = label.replace(/\n/g, "\\n")

    return (`"use client"

import { AxiomButton } from './AxiomButton'

export default function MyPage() {
    return (
        <AxiomButton
            width={${width}}
            height={${height}}
            radius={${radius}}
            travelDistance={${travelDistance}}
            scale={2}
            gap={0.2}
            label={"${labelString}"}
            buttonColor="${buttonColor}"
            textOffColor="${textOffColor}"
            textOnColor="${textOnColor}"
            onClick={() => console.log("'${labelString}' button clicked!")}
        />
    )
}`)
}

const terminalCommand = `npm install three @react-three/fiber @react-three/drei @react-spring/three 
npm install -D @types/three`

const componentCode = `"use client"

import { ContactShadows, Environment, OrthographicCamera, RoundedBox, Text } from "@react-three/drei"
import { useMemo, useState } from "react"
import { animated, useSpring } from "@react-spring/three"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"

interface AxiomButtonProps {
    onClick?: () => void
    width: number
    height: number
    radius?: number
    gap?: number
    travelDistance?: number
    label?: string
    pageColor?: string
    backColor?: string
    buttonColor?: string
    textOffColor?: string
    textOnColor?: string
    scale?: number
    disabled?: boolean
}

export function AxiomButton({
    onClick,
    width,
    height,
    radius = 0.4,
    gap = 0.15,
    scale = 1,
    travelDistance = 0.4,
    label = "Click",
    pageColor = "#ffffff",
    buttonColor = "#ffffff",
    textOffColor = "#a1a1a1",
    textOnColor = "#006726",
    backColor,
    disabled = false,
}: AxiomButtonProps) {
    const [ isPressed, setIsPressed ] = useState(false)

    // Structural Guardrail: Prevents the radius from breaking the geometry if it exceeds half the height
    const safeRadius = Math.min(radius, (width / 2) - 0.01, (height / 2) - 0.01)
    const shadowBound = (Math.max(width, height) + 6)

    const { positionZ } = useSpring({
        positionZ: isPressed ? -travelDistance : 0,
        config: { mass: 1, tension: 600, friction: 20} 
    })

    // Default Trench Color is a 15% darker shade of buttonColor
    const trenchColor = useMemo(() => {
        return backColor ? backColor : new THREE.Color(buttonColor).lerp(new THREE.Color("#000000"), 0.6)
    }, [backColor, buttonColor])

    // Procedural Geometry: The Infinite Page Cutout
    const cutoutGeometry = useMemo(() => {
        const shape = new THREE.Shape()

        // 1. Draw a massive outer boundary (acts as the infinite page)
        // Drawn Clockwise
        shape.moveTo(-100, 100)
        shape.lineTo(100, 100)
        shape.lineTo(100, -100)
        shape.lineTo(-100, -100)
        shape.lineTo(-100, 100)

        // 2. Draw the inner rounded hole (The Trench)
        // Drawn Counter-Clockwise to punch the void
        const hW = width + gap;
        const hH = height + gap;
        const hR = safeRadius + (gap / 2); 
        const x = -hW/2, y = -hH/2

        const hole = new THREE.Path()

        hole.absarc(x + hW - hR, y + hR, hR, -Math.PI / 2, 0, false); // Bottom Right
        hole.absarc(x + hW - hR, y + hH - hR, hR, 0, Math.PI / 2, false); // Top Right
        hole.absarc(x + hR, y + hH - hR, hR, Math.PI / 2, Math.PI, false); // Top Left
        hole.absarc(x + hR, y + hR, hR, Math.PI, Math.PI * 1.5, false); // Bottom Left
        
        shape.holes.push(hole)
        return shape
    }, [gap, safeRadius, width, height])

    return (
        <div className="relative w-full h-full min-w-50 min-h-50 flex items-center justify-center shrink-0">
            <Canvas
                shadows={{ type: THREE.PCFShadowMap }}
                className="w-full h-full"
            >
                {/* Dynamically pull camera back if the button gets wider */}
                <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={(40 - (Math.max(width, height) * 1.5)) * scale} />

                <group rotation={[0, 0, 0]}>
                    <group>
                        {/* Dynamic Trench Floor */}
                        <RoundedBox
                            args={[width + (gap * 0.9), height + gap, 0.2]}
                            radius={safeRadius + (gap / 2)}
                            receiveShadow
                            position={[0, 0, -0.9]}
                        >
                            <meshStandardMaterial color={trenchColor} roughness={0.8} />
                        </RoundedBox>

                        <mesh receiveShadow castShadow position={[0, 0, -0.8]}>
                            <extrudeGeometry args={[cutoutGeometry, {
                                depth: 0.8,
                                bevelEnabled: true,
                                bevelThickness: 0.05,
                                bevelSize: 0.05,
                                bevelSegments: 8,
                                curveSegments: 24
                            }]} />
                            <meshBasicMaterial attach="material-0" transparent opacity={0} depthWrite={false}/>
                            <meshStandardMaterial attach="material-1" color={pageColor} roughness={0.5} toneMapped={false}/>
                        </mesh>
                    </group>

                    <animated.group
                        position-z={positionZ}
                        onClick={(e) => {
                            if (disabled) return
                            e.stopPropagation()
                            if (onClick) onClick()
                        }}
                        onPointerDown={(e) => { 
                            if (disabled) return
                            e.stopPropagation()
                            setIsPressed(true)
                        }}
                        onPointerUp={(e) => { 
                            if (disabled) return
                            e.stopPropagation()
                            setIsPressed(false)
                        }}
                        onPointerLeave={(e) => {
                            if (disabled) return
                            e.stopPropagation()
                            setIsPressed(false)
                        }}
                    >
                        <RoundedBox args={[width, height, 0.8]} radius={radius} castShadow receiveShadow>
                            <meshStandardMaterial
                                color={buttonColor}
                                roughness={0.6}
                                toneMapped={false}
                            />
                        </RoundedBox>
                        
                        { label !== "" && (
                            <Text
                                position={[0, 0, 0.401]}
                                fontSize={Math.min(width, height) * 0.35}
                                fontWeight={800}
                                textAlign="center"
                                lineHeight={1.1}
                                maxWidth={width * 0.85}
                            >
                                ${`{label.replace(/\\n/g, "\n")}`.replace(/\n/g, "\\n")}
                                <meshBasicMaterial
                                    color={ isPressed ? textOnColor : textOffColor }
                                    toneMapped={false}
                                />
                            </Text>
                        )}
                    </animated.group>
                </group>

                {/* Soft Contact Shadows on the floor of the trench */}
                <ContactShadows opacity={0.3} width={width * 3} height={height * 3} blur={2} far={10} resolution={512} position={[0, 0, -0.79]} color="#000000" />

                <Environment preset="city" environmentIntensity={0.5} />
                <ambientLight intensity={1} />
                <directionalLight
                    castShadow
                    position={[-2, 6, 4]}
                    intensity={1.2}
                    shadow-mapSize={[1024, 1024]}
                    shadow-bias={-0.0001}

                    shadow-camera-left={-shadowBound}
                    shadow-camera-right={shadowBound}
                    shadow-camera-top={shadowBound}
                    shadow-camera-bottom={-shadowBound}
                />
            </Canvas>
        </div>
    )
}`
