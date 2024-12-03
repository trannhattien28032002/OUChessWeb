import React from "react";

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import * as STDLIB from "three-stdlib";

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        B_Pawn: THREE.Mesh
    };
    materials: {
        [`B_Pawn_Material`]: THREE.MeshStandardMaterial
    }
}

export const BlackPawnModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/b-pawn-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.B_Pawn.geometry} />
}

useGLTF.preload(`/assets/b-pawn-stone.gltf`)