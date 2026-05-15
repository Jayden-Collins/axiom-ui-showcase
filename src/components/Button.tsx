"use client"

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
        <div className="relative w-full h-full flex items-center justify-center shrink-0">
            <Canvas
                shadows={{ type: THREE.PCFShadowMap }}
                className="w-full h-full"
                style={{ touchAction: "pan-y" }}
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
                        e.stopPropagation();
                        if (onClick) onClick();
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
                            {label.replace(/\\n/g, "\n")}
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
}
