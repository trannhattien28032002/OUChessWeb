import React from 'react';

import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';
import * as STDLIB from 'three-stdlib';

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        W_Bishop: THREE.Mesh
    };
    materials: {
        [`W_Bishop_Material`]: THREE.MeshStandardMaterial
    }
}

export const WhiteBishopModel: React.FC = () => {
    const { nodes } = useGLTF(`/assets/w-bishop-stone.gltf`) as unknown as GLTFResult
    return <mesh attach='geometry' {...nodes.W_Bishop.geometry} />
}

useGLTF.preload(`/assets/w-bishop-stone.gltf`)