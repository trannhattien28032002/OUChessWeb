import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import type { Position } from "src/interfaces/gameplay/chess";
import { useSpring, animated } from "@react-spring/three";
import type { AnimationControls, TargetAndTransition, VariantLabels, Transition } from "framer-motion";
import { motion } from "framer-motion-3d";
import { IsSlidingPiece } from "src/share/gamecore/board/Piece";
import * as Sound from "src/util/Sound";
import { RootState } from "src/app/store";
import { useAppSelector } from "src/app/hooks";

export const PieceMaterial: FC<
    JSX.IntrinsicElements[`meshPhysicalMaterial`] & {
        isSelected: boolean;
        pieceIsBeingReplaced: boolean;
    }
> = ({ color, isSelected, pieceIsBeingReplaced, ...props }) => {
    const { opacity } = useSpring({
        opacity: pieceIsBeingReplaced ? 0 : 1,
    });
    return (
        // @ts-ignore
        <animated.meshPhysicalMaterial
            reflectivity={4}
            color={color === `white` ? `#d9d9d9` : `#7c7c7c`}
            emissive={isSelected ? `#733535` : `#000000`}
            metalness={1}
            roughness={0.3}
            attach="material"
            envMapIntensity={0.2}
            opacity={opacity}
            transparent={true}
            {...props}
        />
    );
};

export type ModelProps = JSX.IntrinsicElements[`group`] & {
    color: string;
    isSelected: boolean;
    canMoveHere: Position | null;
    movingTo: Position | null;
    finishMovingPiece: () => void;
    pieceIsBeingReplaced: boolean;
    wasSelected: boolean;
};

export const MeshWrapper: FC<ModelProps> = ({
    movingTo,
    finishMovingPiece,
    isSelected,
    children,
    pieceIsBeingReplaced,
    wasSelected,
    ...props
}) => {
    const ref = useRef(null);
    const meshRef = useRef(null);
    const playerColor = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);
    const turn = useAppSelector((state: RootState) => state.roomReducer.gameState.turn);

    return (
        <group ref={ref} {...props} dispose={null} castShadow>
            <motion.mesh
                ref={meshRef}
                scale={0.03}
                castShadow={pieceIsBeingReplaced ? false : true}
                receiveShadow
                initial={false}
                animate={
                    movingTo !== null
                        ? variants.move({ movingTo, isSelected })
                        : pieceIsBeingReplaced
                        ? variants.replace({ movingTo, isSelected })
                        : isSelected
                        ? variants.select({ movingTo, isSelected })
                        : variants.initial({ movingTo, isSelected })
                }
                transition={
                    movingTo !== null
                        ? transitions.moveTo
                        : pieceIsBeingReplaced
                        ? transitions.replace
                        : isSelected
                        ? transitions.select
                        : transitions.initial
                }
                onAnimationComplete={() => {
                    if (movingTo) {
                        if (turn === playerColor || turn === 0) {
                            Sound.allyMove();
                        } else {
                            Sound.opponentMove();
                        }
                        finishMovingPiece();
                    }
                }}
            >
                {children}
                <PieceMaterial
                    color={props.color}
                    pieceIsBeingReplaced={pieceIsBeingReplaced}
                    isSelected={isSelected}
                />
            </motion.mesh>
        </group>
    );
};

export const FRAMER_MULTIPLIER = 2;
export const getDistance = (px?: number): number => {
    return px ? px * FRAMER_MULTIPLIER : 0;
};

export const transitions: {
    select: Transition;
    moveTo: Transition & { y: Transition };
    initial: Transition;
    replace: Transition;
    wasSelected: Transition;
} = {
    moveTo: {
        type: `spring`,
        stiffness: 200,
        damping: 30,
        duration: 0.5,
        y: { delay: 0.25, stiffness: 120, damping: 5 },
    },
    select: {
        type: `spring`,
    },
    replace: {
        type: `spring`,
        stiffness: 50,
        damping: 500,
    },
    initial: {
        duration: 0,
    },
    wasSelected: {
        type: `spring`,
        duration: 0.5,
    },
};

export type VariantReturns = AnimationControls | TargetAndTransition | VariantLabels | boolean;
export type VariantProps = {
    isSelected: boolean;
    movingTo: Position | null;
};

type VariantFunction = (props: VariantProps) => VariantReturns;
export const variants: {
    select: VariantFunction;
    move: VariantFunction;
    replace: VariantFunction;
    initial: VariantFunction;
} = {
    initial: () => ({
        x: 0,
    }),
    select: ({ isSelected }: VariantProps) => ({
        x: 0,
        y: isSelected ? 1.4 : 0,
        z: 0,
    }),
    move: ({ movingTo }: VariantProps) => ({
        x: getDistance(movingTo?.x),
        y: 0,
        z: getDistance(movingTo?.y),
    }),
    replace: () => ({
        y: 20,
        x: 5 * randomNegative(),
        z: 10 * randomNegative(),
        rotateX: (Math.PI / 4) * randomNegative(),
    }),
};

const randomNegative = () => (Math.random() > 0.5 ? -1 : 1);
