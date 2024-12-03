import React from "react";

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import * as STDLIB from "three-stdlib";

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        B_Rook: THREE.Mesh
    };
    materials: {
        [`B_Rook_Material`]: THREE.MeshStandardMaterial
    }
}

export const BlackRookModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/b-rook-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.B_Rook.geometry} />
}

useGLTF.preload(`/assets/b-rook-stone.gltf`)