import React, { useRef } from 'react';

import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';
import * as STDLIB from 'three-stdlib';

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        W_Queen: THREE.Mesh
    };
    materials: {
        [`W_Queen_Material`]: THREE.MeshStandardMaterial
    }
}

export const WhiteQueenModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/w-queen-stone.gltf`) as unknown as GLTFResult
    return <mesh attach="geometry" {...nodes.W_Queen.geometry} />
}

useGLTF.preload(`/assets/w-queen-stone.gltf`)