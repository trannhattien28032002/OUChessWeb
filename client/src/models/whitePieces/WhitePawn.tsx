import React from 'react';

import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';
import * as STDLIB from 'three-stdlib';

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        W_Pawn: THREE.Mesh
    };
    materials: {
        [`W_Pawn_Material`]: THREE.MeshStandardMaterial
    }
}

export const WhitePawnModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/w-pawn-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.W_Pawn.geometry} />
}

useGLTF.preload(`/assets/w-pawn-stone.gltf`)