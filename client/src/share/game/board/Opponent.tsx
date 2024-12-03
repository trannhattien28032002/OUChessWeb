import { useEffect, type FC } from "react";

import { animated, useSpring } from "@react-spring/three";
import { Float, Html } from "@react-three/drei";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

export const Opponent: FC = () => {
    const handleClick = () => {
        console.log(`click`);
    };

    const position = useAppSelector((state: RootState) => state.opponentReducer.position);
    const name = useAppSelector((state: RootState) => state.opponentReducer.name);
    const playerColor = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);

    const { smoothPosition } = useSpring({
        smoothPosition: position,
    });

    return (
        <Float speed={7} rotationIntensity={0.05} floatIntensity={1}>
            <animated.group position={smoothPosition}>
                <Html
                    style={{
                        width: `100px`,
                        height: `100px`,
                        borderRadius: `50%`,
                        display: `flex`,
                        justifyContent: `center`,
                        alignItems: `center`,
                        color: `white`,
                        fontSize: `16px`,
                        userSelect: `none`,
                    }}
                    center
                    occlude={true}
                    prepend={true}
                    position={[0, 1.2, 0]}
                >
                    {name}
                </Html>
                <mesh position={[0, 0, 0]} onClick={handleClick}>
                    <sphereGeometry args={[0.5, 50, 10]} />
                    <meshStandardMaterial
                        metalness={1}
                        roughness={0.4}
                        color={playerColor === 0 ? `#4b4b4b` : `#ffffff`}
                    />
                </mesh>
            </animated.group>
        </Float>
    );
};
