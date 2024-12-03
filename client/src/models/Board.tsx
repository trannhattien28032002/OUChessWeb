import React from "react";

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import * as STDLIB from "three-stdlib";

interface GLTFResult extends STDLIB.GLTF {
    nodes: {
        Chess_Board_Border: THREE.Mesh;
        Chess_Board_Border_Tile: THREE.Mesh;
        Chess_Board_Tile_Black: THREE.Mesh;
        Chess_Board_Tile_White: THREE.Mesh;
    };
    materials: {
        [`Chess_Board_Border_Material`]?: THREE.MeshStandardMaterial;
        [`Chess_Board_Border_Tile_Material`]: THREE.MeshStandardMaterial;
        [`Chess_Board_Tile_Black_Material`]: THREE.MeshStandardMaterial;
        [`Chess_Board_Tile_White_Material`]: THREE.MeshStandardMaterial;
    }
}

export const BoardModel: React.FC = () => {
    const { nodes, materials } = useGLTF(`/assets/board-stone.gltf`) as unknown as GLTFResult

    return <>
        <mesh
            geometry={nodes.Chess_Board_Border.geometry}
            material={materials["Chess_Board_Border_Material"]}
            scale={[0.01416, 0.01416, 0.01398]}
            position={[-0.5, -0.8, -0.65]}
        />
        {/* <mesh
            geometry={nodes.Chess_Board_Border_Tile.geometry}
            material={materials["Chess_Board_Border_Tile_Material"]}
            scale={[0.01416, 0.01416, 0.01398]}
            position={[-0.5, -0.8, -0.65]}
        />
        <mesh
            geometry={nodes.Chess_Board_Tile_Black.geometry}
            material={materials["Chess_Board_Tile_Black_Material"]}
            scale={[0.01416, 0.01416, 0.01398]}
            position={[-0.5, -0.8, -0.65]}
        />
        <mesh
            geometry={nodes.Chess_Board_Tile_White.geometry}
            material={materials["Chess_Board_Tile_White_Material"]}
            scale={[0.01416, 0.01416, 0.01398]}
            position={[-0.5, -0.8, -0.65]}
        /> */}
    </>
}

useGLTF.preload(`/assets/board-stone.gltf`)