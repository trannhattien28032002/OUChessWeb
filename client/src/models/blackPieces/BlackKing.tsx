import React from "react";

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import * as STDLIB from "three-stdlib";

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        B_King: THREE.Mesh
    };
    materials: {
        [`B_King_Material`]: THREE.MeshStandardMaterial
    }
}

export const BlackKingModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/b-king-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.B_King.geometry} />
}

useGLTF.preload(`/assets/b-king-stone.gltf`)