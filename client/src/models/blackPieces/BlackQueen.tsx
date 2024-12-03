import React from "react";

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import * as STDLIB from "three-stdlib";

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        B_Queen: THREE.Mesh
    };
    materials: {
        [`B_Queen_Material`]: THREE.MeshStandardMaterial
    }
}

export const BlackQueenModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/b-queen-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.B_Queen.geometry} />
}

useGLTF.preload(`/assets/b-queen-stone.gltf`)