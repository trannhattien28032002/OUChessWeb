import gsap from "gsap";
import { PerspectiveCamera, useHelper } from "@react-three/drei";
import  {TextureLoader, Mesh, SpotLightHelper, SpotLight, Object3D} from "three";
import React, { FC, useEffect, useRef } from "react";
import { WhiteKingModel } from "src/models/whitePieces/WhiteKing";
import { WhiteBishopModel } from "src/models/whitePieces/WhiteBishop";
import { WhiteKnightModel } from "src/models/whitePieces/WhiteKnight";
import { useLoader } from "@react-three/fiber";
import logo from 'src/assets/images/chess-realm-logo-2.png';
const LoginScene: FC = () => {
    const klRef = useRef<Mesh>(null);
    const krRef = useRef<Mesh>(null);
    const lightRef = useRef<SpotLight>(null)
    const target1 = new Object3D();
    const texture = useLoader(TextureLoader, logo);

    target1.position.set(-100, 150, 0);
    useHelper(lightRef as React.MutableRefObject<Object3D>, SpotLightHelper)
    const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 3,
        yoyo: true
    });

    const tl2 = gsap.timeline({
        repeat: -1,
        repeatDelay: 3,
        yoyo: true
    })

    const tl3 = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        yoyo: true
    })

    useEffect(() => {
        if(klRef.current && krRef.current){
            tl.from(klRef.current.rotation, {
                y: 0   
            })
            
            tl2.from(krRef.current?.rotation, {
                y: (Math.PI / 180) * 180
            })

            tl.to(klRef.current?.rotation, {
                duration: 3,
                y: - (Math.PI / 180) * 80,
            });

            tl2.to(krRef.current.rotation, {
                duration: 3,
                y: (Math.PI / 180) * 270
            })
        }

        tl.startTime(2);
        tl2.startTime(2);

        tl3.from(target1.position, {
            x: -100,
            y: 150,
            z: 0,
        }).to(target1.position, {
            duration: 10,
            x:100
        })

    }, []) 

    return (
        <>
            <mesh position={[0, 0, 0]}>
                <spotLight
                    color={"#ff0000"}
                    intensity={1}
                    distance={0}
                    position={[0, 200, 250]}
                    target={target1}
                    penumbra={0.25}
                    decay={200000000000000000000}
                    rotation-x={(Math.PI / 180) * 45}
                    angle={0.5}
                 />

                <PerspectiveCamera
                    fov={45}
                    aspect={window.innerWidth / window.innerHeight}
                    near={1}
                    far={20000}
                    makeDefault
                    position={[160, 100, 500]}
                />
                <mesh position={[50, 150, -50]}>
                    <boxGeometry args={[550, 300, 10]} />
                    <meshPhongMaterial attach='material' map={texture} />
                </mesh>
                <group>
                    <mesh scale={0.5} position={[-200, 0, 0]}>
                        <WhiteKingModel />
                        <meshPhongMaterial />
                    </mesh>
                    <mesh scale={0.5} position={[-170, 0, 0]}>
                        <WhiteBishopModel />
                        <meshPhongMaterial />
                    </mesh>
                    <mesh scale={0.5} position={[-140, 0, 0]} ref={klRef}>
                        <WhiteKnightModel />
                        <meshPhongMaterial />
                    </mesh>
                    {/* <mesh scale={0.5} position={[-90, 0, 0]}>
                        <WhiteKingModel />
                        <meshPhongMaterial />
                    </mesh>
                    <mesh scale={0.5} position={[-60,0, 0]}>
                        <WhiteQueenModel />
                        <meshPhongMaterial />
                    </mesh> */}
                    <mesh scale={0.5} position={[240, 0, 0]} rotation-y={(Math.PI / 180) * 180} ref={krRef}>
                        <WhiteKnightModel />
                        <meshPhongMaterial />
                    </mesh>
                    <mesh scale={0.5} position={[270, 0, 0]}>
                        <WhiteBishopModel />
                        <meshPhongMaterial />
                    </mesh>
                    <mesh scale={0.5} position={[300, 0, 0]}>
                        <WhiteKingModel />
                        <meshPhongMaterial />
                    </mesh>  
                </group>
            </mesh>
        </>
    );
};

export default LoginScene;
