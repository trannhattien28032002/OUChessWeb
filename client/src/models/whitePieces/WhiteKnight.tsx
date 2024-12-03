import React from 'react';

import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';
import * as STDLIB from 'three-stdlib';

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        W_Knight: THREE.Mesh
    };
    materials: {
        [`W_Knight_Material`]: THREE.MeshStandardMaterial
    }
}

export const WhiteKnightModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/w-knight-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.W_Knight.geometry} />
}

useGLTF.preload(`/assets/w-knight-stone.gltf`)