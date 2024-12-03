import type { FC } from "react";
import React, { useEffect, useState } from "react";

import Board from "src/interfaces/gamecore/board/Board";
import MoveGenerator from "src/interfaces/gamecore/move/MoveGenerator";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";

import { checkIfPositionsMatch } from "src/share/game/logic/Board";
import type { ModelProps } from "src/models";
import { MeshWrapper } from "src/models";
import { WhiteBishopModel } from "src/models/whitePieces/WhiteBishop";
import { WhiteKingModel } from "src/models/whitePieces/WhiteKing";
import { WhiteKnightModel } from "src/models/whitePieces/WhiteKnight";
import { WhitePawnModel } from "src/models/whitePieces/WhitePawn";
import { WhiteQueenModel } from "src/models/whitePieces/WhiteQueen";
import { WhiteRookModel } from "src/models/whitePieces/WhiteRook";
import { TileModel } from "src/models/Tile";
import type { EndGame, MovingTo, ThreeMouseEvent } from "src/components/game/Game";
import { useSpring, animated } from "@react-spring/three";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { socket } from "src/index";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { Color, Position } from "src/interfaces/gameplay/chess";
import { roomAction } from "src/redux/reducer/room/RoomReducer";

import * as GameResult from "src/interfaces/gamecore/result/GameResult";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import * as Piece from "src/interfaces/gamecore/board/Piece";
import * as MoveUtility from "src/interfaces/gamecore/helper/MoveUtility";

import { Moving } from "src/redux/reducer/room/Types";

export type MakeMoveClient = {
    movingTo: MovingTo;
    roomId: string | null | undefined;
};

export type CameraMove = {
    position: [number, number, number];
    roomId: string | null | undefined;
    color: Color;
};

export const BoardComponent: FC<{
    selected: number | null;
    setSelected: (piece: number | null) => void;
    targeted: number | null;
    setTargeted: (piece: number | null) => void;
    board?: Board;
    setBoard?: React.Dispatch<React.SetStateAction<Board>>;
    moves: number[];
    setEndGame: (endGame: EndGame | null) => void;
    setMoves: (moves: number[]) => void;
    showPromotionDialog: boolean;
    setShowPromotionDialog: (showPromotionDialog: boolean) => void;
    lastSelected: number | null;
    setLastSelected: (lastSelected: number | null) => void;
    movingTo?: Move;
    whiteTimer: number;
    blackTimer: number;
}> = ({
    selected,
    setSelected,
    targeted,
    setTargeted,
    board,
    setBoard,
    moves,
    setMoves,
    setEndGame,
    showPromotionDialog,
    setShowPromotionDialog,
    lastSelected,
    setLastSelected,
    blackTimer,
    whiteTimer,
}) => {
    const playerColor = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const turn = useAppSelector((state: RootState) => state.roomReducer.gameState.turn);
    const isStarted = useAppSelector((state: RootState) => state.roomReducer.gameState.isStarted);
    const whiteCounter = useAppSelector((state: RootState) => state.roomReducer.gameState.whiteTimer);
    const blackCounter = useAppSelector((state: RootState) => state.roomReducer.gameState.blackTimer);
    const moving = useAppSelector((state: RootState) => state.roomReducer.gameAction.move);
    const dispatch = useAppDispatch();

    const [redLightPosition, setRedLightPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const moveGenerator = new MoveGenerator();

    const IsHightLigt = (board: Board, start: number | null, target: number) => {
        if (start === null) return null;
        const moves = moveGenerator.GenerateMoves(board, false);

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            if (move.StartSquare() === start && move.TargetSquare() === target) {
                return {
                    target: move.TargetSquare(),
                    flag: move.MoveFlag(),
                };
            }
        }

        return null;
    };

    const getStep = (start: number, target: number, isWhite: number) => {
        const movingTo = {
            x: BoardHelper.RankIndex(Number(target)) - BoardHelper.RankIndex(Number(start)),
            y: BoardHelper.FileIndex(Number(target)) - BoardHelper.FileIndex(Number(start)),
        };
        return movingTo;
    };

    const selectThisPiece = (e: ThreeMouseEvent, squareIndex: number | null) => {
        e.stopPropagation();
        if (!board) return;
        const isPlayersTurn = playerColor === board.MoveColourIndex();
        if (!isStarted) return;
        if (!isPlayersTurn) return;

        if (squareIndex === null) return;

        if (PieceFunc.PieceType(board.Square[squareIndex]) === Piece.PieceType.None && selected === null) return;

        if (PieceFunc.PieceType(board.Square[squareIndex]) === Piece.PieceType.None) {
            setSelected(null);
            return;
        }

        console.log(PieceFunc.PieceType(board.Square[squareIndex]));

        setLastSelected(lastSelected !== squareIndex ? selected : null);
        setSelected(squareIndex);
        setRedLightPosition({
            x: BoardHelper.FileIndex(squareIndex),
            y: BoardHelper.RankIndex(squareIndex),
        });
    };

    const startMovingPiece = (e: ThreeMouseEvent, target: number) => {
        if (!socket) return;
        if (!board) return;
        if (selected !== null && target !== null) {
            if (PieceFunc.PieceType(board.Square[selected]) === Piece.PieceType.Pawn) {
                if (BoardHelper.RankIndex(target) === 7 || BoardHelper.RankIndex(target) === 0) {
                    setTargeted(target);
                    setShowPromotionDialog(true);
                    return;
                }
            }

            dispatch(
                roomAction.requestMoving({
                    rId: detail?.id || "",
                    moving: {
                        startPiece: PieceFunc.PieceType(board.Square[selected]),
                        targetPiece: PieceFunc.PieceType(board.Square[target]),
                        start: selected,
                        target: target,
                    },
                }),
            );
        }
    };

    const finishMovingPiece = (start: number | null, target: number | null, flag: number | null) => {
        if (!board) return;

        if (!target && !start) return;

        if (moving.start === null && moving.target === null) return;

        const newMove = new Move(Number(start), Number(target), Number(flag));

        const str = MoveUtility.GetMoveNameSAN(newMove, board);

        board.MakeMove(newMove, false);

        setSelected(null);
        setTargeted(null);
        const endMoving = {
            start: Number(start),
            target: Number(target),
            flag: Number(flag),
            moveString: str,
        } as Moving;

        dispatch(
            roomAction.endMoving({
                moving: endMoving,
            }),
        );
    };

    useEffect(() => {
        if (!isStarted) return;
        if (!board) return;

        const gameResult = GameResult.GetGameState(board);

        if (gameResult) {
            if (gameResult !== GameResult.GameResult.InProgress) {
                dispatch(roomAction.endGame({ EndType: gameResult }));
            }
        }
        return;
    }, [board]);

    // old code
    // const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
    //     e.stopPropagation()
    //     const isPlayersTurn = turn === playerColor
    //     if (!isPlayersTurn || !gameStarted) return
    //     if (!tile?.piece?.type && !selected) return
    //     if (!tile?.piece) {
    //         setSelected(null)
    //         return
    //     }
    //     dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
    //     setMoves(
    //         movesForPiece({ piece: tile.piece, board, propagateDetectCheck: true }),
    //     )
    //     setSelected(tile.piece)
    //     setLastSelected(tile)
    //     setRedLightPosition(tile.position)
    // }

    // const finishMovingPiece = (tile: Tile | null) => {
    //     if (!tile || !movingTo || !socket) return
    //     const selectedTile = getTile(board, movingTo.move.piece.position)
    //     if (!(selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile }))) {
    //         setBoard((prev) => {
    //             const newBoard = copyBoard(prev)
    //             if (!movingTo.move.piece) return prev
    //             const selectedTile = getTile(newBoard, movingTo.move.piece.position)
    //             const tileToMoveTo = getTile(newBoard, tile.position)

    //             if (!selectedTile || !tileToMoveTo) return prev

    //             if (
    //                 isPawn(selectedTile.piece) ||
    //                 isKing(selectedTile.piece) ||
    //                 isRook(selectedTile.piece)
    //             ) {
    //                 selectedTile.piece = { ...selectedTile.piece, hasMoved: true }
    //             }

    //             if (
    //                 isPawn(selectedTile.piece) &&
    //                 movingTo.move.type === `captureEnPassant`
    //             ) {
    //                 const latestMove = history[history.length - 1]
    //                 const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x]
    //                 enPassantTile.piece = null
    //             }

    //             if (movingTo.move.castling) {
    //                 const rookTile =
    //                     newBoard[movingTo.move.castling.rook.position.y][
    //                     movingTo.move.castling.rook.position.x
    //                     ]
    //                 const rookTileToMoveTo =
    //                     newBoard[movingTo.move.castling.rookNewPosition.y][
    //                     movingTo.move.castling.rookNewPosition.x
    //                     ]
    //                 if (!isRook(rookTile.piece)) return prev

    //                 rookTileToMoveTo.piece = {
    //                     ...rookTile.piece,
    //                     hasMoved: true,
    //                     position: rookTileToMoveTo.position,
    //                 }
    //                 rookTile.piece = null
    //             }

    //             tileToMoveTo.piece = selectedTile.piece
    //                 ? { ...selectedTile.piece, position: tile.position }
    //                 : null
    //             selectedTile.piece = null
    //             return newBoard
    //         })

    //         dispatch(gameSettingActions.setTurn());
    //         dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
    //         setMoves([])
    //         setSelected(null)
    //         setLastSelected(null)
    //     } else {
    //         setTile(tile);
    //         if (playerColor === turn) {
    //             setShowPromotionDialog(true);
    //         }
    //     }
    // }

    // useEffect(() => {
    //     const gameOverType = detectGameOver(board, turn)
    //     if (gameOverType) {
    //         setEndGame({ type: gameOverType, winner: oppositeColor(turn) })
    //         if (gameOverType === `stalemate` || gameOverType === `insufficient material`) {
    //             dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: 0 } }))
    //         }

    //         if (gameOverType === `checkmate`) {
    //             if (oppositeColor(turn) === `white`)
    //                 dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: 1 } }))
    //             else dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: -1 } }))
    //         }
    //     }
    // }, [board, turn])

    // const startMovingPiece = (e: ThreeMouseEvent, tile: Tile, nextTile: Move) => {
    //     e.stopPropagation()
    //     if (!socket) return
    //     const newMovingTo: MovingTo = {
    //         move: nextTile,
    //         tile: tile,
    //     }
    //     const makeMove: MakeMoveClient = {
    //         movingTo: newMovingTo,
    //         roomId: roomId,
    //     }
    //     socket.emit(`makeMove`, makeMove)
    // }

    // old code

    const { intensity } = useSpring({
        intensity: selected ? 0.35 : 0,
    });

    const { camera } = useThree();

    useEffect(() => {
        const interval = setInterval(() => {
            const { x, y, z } = camera.position;
            socket?.emit(`cameraMove`, {
                position: [x, y, z],
                roomId: detail?.id,
                color: playerColor === 1 ? "black" : "white",
            } satisfies CameraMove);
        }, 500);
        return () => clearInterval(interval);
    }, [camera.position, socket, detail, playerColor]);

    // useEffect(() => {
    //     dispatch(gameSettingActions.setIsPromotePawn({ isPromotePawn: false }));
    //     if (!tile || !movingTo || !socket) return
    //     if (playerColor !== turn) {
    //         setBoard((prev) => {
    //             const newBoard = copyBoard(prev)
    //             if (!movingTo.move.piece) return prev
    //             const selectedTile = getTile(newBoard, movingTo.move.piece.position)
    //             const tileToMoveTo = getTile(newBoard, tile.position)

    //             if (tileToMoveTo && selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
    //                 selectedTile.piece.type = promotePawn;
    //                 selectedTile.piece.id = selectedTile.piece.id + 2
    //                 tileToMoveTo.piece = selectedTile.piece
    //                     ? { ...selectedTile.piece, position: tile.position }
    //                     : null
    //                 selectedTile.piece = null
    //             }

    //             return newBoard;
    //         });
    //         dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
    //         dispatch(gameSettingActions.setTurn());
    //         setMoves([])
    //         setSelected(null)
    //         setLastSelected(null)
    //     }
    // }, [isPromotePawn])

    return (
        <>
            <group position={[-4, -0.5, -4]}>
                <OrbitControls maxDistance={25} minDistance={7} enableZoom={true} enablePan={false} />
                <pointLight
                    shadow-mapSize={[2048, 2048]}
                    castShadow
                    position={[3.5, 10, 3.5]}
                    intensity={0.65}
                    color="#ffe0ec"
                />
                <hemisphereLight intensity={0.5} color="#ffa4a4" groundColor="#d886b7" />

                <animated.pointLight
                    intensity={intensity}
                    color="red"
                    position={[redLightPosition.x, 1, redLightPosition.y]}
                />
                {board?.Square.map((square, i) => {
                    const file = BoardHelper.FileIndex(i);
                    const rank = BoardHelper.RankIndex(i);
                    const bg = (file + rank) % 2 === 0 ? `white` : `black`;

                    const isHightLight = IsHightLigt(board, selected, i);
                    const isSelected = selected !== null && selected === i ? true : false;
                    let canMoveHere: Position | null = null;
                    if (isHightLight !== null) {
                        canMoveHere = {
                            x: BoardHelper.RankIndex(isHightLight.target),
                            y: BoardHelper.FileIndex(isHightLight.target),
                        };
                    }

                    const pieceIsBeingReplaced =
                        moving.start !== null &&
                        moving.target !== null &&
                        board.Square[moving.target] !== Piece.PieceType.None &&
                        checkIfPositionsMatch(
                            { x: BoardHelper.RankIndex(i), y: BoardHelper.FileIndex(i) },
                            {
                                x: BoardHelper.RankIndex(Number(moving.target)),
                                y: BoardHelper.FileIndex(Number(moving.target)),
                            },
                        )
                            ? true
                            : false;

                    const handleClick = (e: ThreeMouseEvent) => {
                        if (!isStarted) return;

                        if (moving.start && moving.target) return;

                        if (selected && targeted) return;

                        const tileContainsOtherPlayersPiece =
                            square !== 0 && PieceFunc.PieceColour(square) !== turn * 8;
                        if (tileContainsOtherPlayersPiece && !canMoveHere) {
                            setSelected(null);
                            return;
                        }

                        canMoveHere ? startMovingPiece(e, i) : selectThisPiece(e, i);
                    };

                    const props: ModelProps = {
                        position: [rank, 0.5, file],
                        scale: [0.5, 0.5, 0.5],
                        color: PieceFunc.PieceColour(square) === 0 ? `white` : `black`,
                        onClick: handleClick,
                        isSelected: isSelected,
                        wasSelected: false,
                        canMoveHere: canMoveHere,
                        movingTo:
                            moving &&
                            moving.start !== null &&
                            moving.target !== null &&
                            checkIfPositionsMatch(
                                { x: BoardHelper.RankIndex(i), y: BoardHelper.FileIndex(i) },
                                {
                                    x: BoardHelper.RankIndex(Number(moving.start)),
                                    y: BoardHelper.FileIndex(Number(moving.start)),
                                },
                            )
                                ? getStep(moving.start, moving.target, i)
                                : null,
                        pieceIsBeingReplaced: pieceIsBeingReplaced,
                        finishMovingPiece: () =>
                            pieceIsBeingReplaced
                                ? null
                                : finishMovingPiece(
                                      moving.start,
                                      moving.target,
                                      moving.flag && moving.flag !== null ? moving.flag : null,
                                  ),
                    };

                    return (
                        <group key={`${file}-${rank}`}>
                            <TileModel
                                color={bg}
                                position={[rank, 0.25, file]}
                                onClick={handleClick}
                                canMoveHere={canMoveHere}
                            />
                            <MeshWrapper key={i} {...props}>
                                {PieceFunc.PieceType(square) === 1 && <WhitePawnModel />}
                                {PieceFunc.PieceType(square) === 4 && <WhiteRookModel />}
                                {PieceFunc.PieceType(square) === 2 && <WhiteKnightModel />}
                                {PieceFunc.PieceType(square) === 3 && <WhiteBishopModel />}
                                {PieceFunc.PieceType(square) === 5 && <WhiteQueenModel />}
                                {PieceFunc.PieceType(square) === 6 && <WhiteKingModel />}
                                {/* 
                                    {tile.piece?.type === `pawn` && tile.piece?.color === `black` && <BlackPawnModel />}
                                    {tile.piece?.type === `rook` && tile.piece?.color === `black` && <BlackRookModel />}
                                    {tile.piece?.type === `knight` && tile.piece?.color === `black` && <BlackKnightModel />}
                                    {tile.piece?.type === `bishop` && tile.piece?.color === `black` && <BlackBishopModel />}
                                    {tile.piece?.type === `queen` && tile.piece?.color === `black` && <BlackQueenModel />}
                                    {tile.piece?.type === `king` && tile.piece?.color === `black` && <BlackKingModel />} */}
                            </MeshWrapper>
                        </group>
                    );
                })}
            </group>
        </>
    );
};
