'use client'

import { Environment, Float, OrthographicCamera, useGLTF } from "@react-three/drei"
import { animated, useSpring } from "@react-spring/three"
import * as THREE from "three"
import { useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"

export interface CarvedToggleProps {
    active: boolean,
    onClick: () => void
    pageColor?: string
    trenchColor?: string
    children?: React.ReactNode
    magnetic?: boolean
    className?: string
    onReady?: () => void
    disabled?: boolean
}

function DynamicOrthographicCamera() {
    const { size } = useThree()

    const dynamicZoom = size.width / 2.4

    return (
        <OrthographicCamera
            makeDefault
            position={[0, 0, 5]}
            zoom={dynamicZoom}
        />
    )
}

function EngineReporter({ onReady } : { onReady?: () => void}) {
    useEffect(() => {
        if (onReady) {
            const timer = setTimeout(() => onReady(), 100)
            return () => clearTimeout(timer)
        }
    }, [onReady])
    return null
}

export function CarvedToggle({
    active,
    onClick,
    children,
    magnetic,
    className = "w-14",
    onReady,
    disabled = false,
} : CarvedToggleProps ) {
    const { nodes } = useGLTF('/models/CarvedToggleRemesh-transformed.glb');

    const { rotationY } = useSpring({
        rotationY: active ? 0.6 : -0.6, 
        config: { mass: 1, tension: 500, friction: 34 }
    });

    const toggleGeometry = (
        <animated.group
            rotation-y={rotationY}
        >
            <mesh
                geometry={(nodes.Cylinder as THREE.Mesh).geometry}
                rotation={[Math.PI, THREE.MathUtils.degToRad(0), Math.PI]}
            >
                <meshStandardMaterial
                    color={ active ? "#34c759" : "#ffffff"}
                    roughness={0.4}
                />
            </mesh>
        </animated.group>
    )

  return (
    <div
        className={`cursor-pointer aspect-14/6 flex items-center justify-center shrink-0 ${className}`}
        onClick={() => { if (!disabled) onClick() }}
    >
        <Canvas className="w-full h-full pointer-events-none">
            <EngineReporter onReady={onReady} />

            {children}

            {!children && <DynamicOrthographicCamera/>}
            
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 10, 8]} intensity={1.5} castShadow />

            { magnetic ? (
                <Float
                    speed={3} // animation speed
                    floatIntensity={0.5} // up/down hover
                    floatingRange={[-0.2, 0.2]}
                >
                    {toggleGeometry}                   
                </Float>
            ) : (
                toggleGeometry
            )}
        </Canvas>
    </div>
  );
}

if (typeof window !== "undefined") {
    useGLTF.preload('/models/CarvedToggleRemesh-transformed.glb')
}
