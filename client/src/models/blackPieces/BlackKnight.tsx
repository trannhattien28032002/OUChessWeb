import React from "react";

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import * as STDLIB from "three-stdlib";

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        B_Knight: THREE.Mesh
    };
    materials: {
        [`B_Knight_Material`]: THREE.MeshStandardMaterial
    }
}

export const BlackKnightModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/b-knight-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.B_Knight.geometry} />
}

useGLTF.preload(`/assets/b-knight-stone.gltf`)