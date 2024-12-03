import React from "react";

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import * as STDLIB from "three-stdlib";

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        B_Bishop: THREE.Mesh
    };
    materials: {
        [`B_Bishop_Material`]: THREE.MeshStandardMaterial
    }
}

export const BlackBishopModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/b-bishop-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.B_Bishop.geometry} />
}

useGLTF.preload(`/assets/b-bishop-stone.gltf`)