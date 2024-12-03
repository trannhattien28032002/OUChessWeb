import type { FC } from "react";

import { useSpring, animated } from "@react-spring/three";

import type { Position } from "src/interfaces/gameplay/chess";

// import * as THREE from "three"

// const glowVertexShader = `
// varying vec3 vNormal;
// void main() {
//     vNormal = normalize(normalMatrix * normal);
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `

// const glowFragmentShader = `
// varying vec3 vNormal;
// void main() {
//     vec3 normal = normalize(vNormal);
//     float intensity = dot(normal, normalize(vec3(0.0, 1.0, 0.0))); // Tùy chỉnh độ sáng ở đây
//     gl_FragColor = vec4(1.0, 1.0, 0.0, intensity); // Màu và độ sáng của vòng sáng
// }
// `

// const glowMaterial = new THREE.ShaderMaterial({
//     uniforms: {},
//     vertexShader: glowVertexShader,
//     fragmentShader: glowFragmentShader,
//     transparent: true,
//     side: THREE.DoubleSide,
// })

const getColor = (color: string, canMoveHere: boolean) => {
    if (canMoveHere) {
        return `#ff0101`
    }
    if (color === `white`) {
        return `#000000`
    }
    if (color === `black`) {
        return `#ffffff`
    }
    return `purple`
}

const getEmissive = (color: string, canMoveHere: boolean) => {
    if (canMoveHere && color === `white`) {
        return `#800000`
    }
    if (canMoveHere && color === `black`) {
        return `#FF8080`
    }
    return `black`
}

export const TileMaterial: FC<
    JSX.IntrinsicElements[`meshPhysicalMaterial`] & {
        canMoveHere: Position | null
    }
> = ({ color, canMoveHere, ...props }) => {
    const { tileColor, emissiveColor } = useSpring({
        tileColor: getColor(color as string, !!canMoveHere),
        emissiveColor: getEmissive(color as string, !!canMoveHere),
    })
    return (
        <>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <animated.meshPhysicalMaterial
                reflectivity={3}
                color={tileColor}
                emissive={emissiveColor}
                metalness={0.9}
                roughness={0.8}
                envMapIntensity={0.15}
                attach="material"
                {...props}
            />
        </>
    )
}

export const TileModel: FC<
    JSX.IntrinsicElements[`mesh`] & {
        canMoveHere: Position | null,
        color: string
        // isSelected: boolean
    }
> = ({ color, canMoveHere, ...props }) => {
    return (
        <group>
            <mesh scale={[1, 0.5, 1]} receiveShadow castShadow {...props}>
                <boxGeometry />
                <TileMaterial color={color} canMoveHere={canMoveHere} />
            </mesh>
            {/* {isSelected && (
                <mesh scale={[1.2, 0.6, 1.2]} position={[0, 0.4, 0]} {...props}>
                    <boxGeometry />
                    {isSelected && <primitive object={glowMaterial} />}
                </mesh>
            )} */}
        </group>
    )
}
