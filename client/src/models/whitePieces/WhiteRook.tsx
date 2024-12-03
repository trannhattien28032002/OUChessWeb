import React from 'react';

import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';
import * as STDLIB from 'three-stdlib';

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        W_Rook: THREE.Mesh
    };
    materials: {
        [`W_Rook_Material`]: THREE.MeshStandardMaterial
    }
}

export const WhiteRookModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/w-rook-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.W_Rook.geometry} />
}

useGLTF.preload(`/assets/w-rook-stone.gltf`)