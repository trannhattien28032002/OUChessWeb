import React from 'react';

import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';
import * as STDLIB from 'three-stdlib';

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        W_King: THREE.Mesh
    };
    materials: {
        [`W_King_Material`]: THREE.MeshStandardMaterial
    }
}

export const WhiteKingModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/w-king-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.W_King.geometry} />
}

useGLTF.preload(`/assets/w-king-stone.gltf`)