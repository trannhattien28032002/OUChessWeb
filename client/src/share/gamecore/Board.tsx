import { OrbitControls } from "@react-three/drei";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Color, EndGameType, Position, Tile } from "src/interfaces/gameplay/chess";
import { animated, useSpring } from "@react-spring/three";
import { checkIfPositionsMatch, copyBoard, createBoard } from "../game/logic/Board";
import { MeshWrapper, ModelProps } from "src/models";
import { TileModel } from "src/models/Tile";
import { WhitePawnModel } from "src/models/whitePieces/WhitePawn";
import { WhiteRookModel } from "src/models/whitePieces/WhiteRook";
import { WhiteKnightModel } from "src/models/whitePieces/WhiteKnight";
import { WhiteBishopModel } from "src/models/whitePieces/WhiteBishop";
import { WhiteQueenModel } from "src/models/whitePieces/WhiteQueen";
import { WhiteKingModel } from "src/models/whitePieces/WhiteKing";
import {
    checkIfSelectedPieceCanMoveHere,
    createId,
    detectGameOver,
    getTile,
    movesForPiece,
    shouldPromotePawn,
} from "../game/logic/pieces";
import { MovingTo, ThreeMouseEvent, useHistoryState } from "src/components/game/Game";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { isPawn } from "../game/logic/pieces/Pawn";
import { isKing } from "../game/logic/pieces/King";
import { isRook } from "../game/logic/pieces/Rook";
import { MakeMoveClient } from "../game/board/Board";
import { Exception } from "sass";

import Board from "src/interfaces/gamecore/board/Board";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import * as Piece from "src/interfaces/gamecore/board/Piece";
import * as MoveUtility from "src/interfaces/gamecore/helper/MoveUtility";

import Move from "src/interfaces/gamecore/board/Move";
import MoveGenerator from "src/interfaces/gamecore/move/MoveGenerator";
import { connectStorageEmulator } from "firebase/storage";
import Searcher from "src/interfaces/gamecore/botChess/search/Searcher";
import * as GameResult from "src/interfaces/gamecore/result/GameResult";

interface Props {
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    setMove?: (str: string) => void;
    moving?: Move | null;
    setMoving?: (move: Move | null) => void;
    turning?: number | null;
    setTurning?: (turn: number) => void;
}

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

export const BoardDefault: FC<Props> = ({ board, setBoard, setMove, moving, setMoving, setTurning }) => {
    const [redLightPosition, setRedLightPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const [selected, setSelected] = useState<number | null>(null);
    const [prevSelected, setPrevSelected] = useState<number | null>(null);
    const [step, setStep] = useState<Position | null>(null);
    const [targeted, setTargeted] = useState<number | null>(null);
    const [turn, setTurn] = useState<number>(0);

    const { intensity } = useSpring({
        intensity: selected ? 0.35 : 0,
    });

    const selectThisPiece = (e: ThreeMouseEvent, squareIndex: number | null) => {
        e.stopPropagation();
        const isPlayersTurn = turn === board.MoveColourIndex();
        if (!isPlayersTurn) return;
        if (!squareIndex) return;

        if (PieceFunc.PieceType(board.Square[squareIndex]) === Piece.PieceType.None && !selected) return;

        if (PieceFunc.PieceType(board.Square[squareIndex]) === Piece.PieceType.None) {
            setSelected(null);
            return;
        }

        setPrevSelected(() => {
            return prevSelected !== squareIndex ? selected : null;
        });
        setSelected(squareIndex);
        setRedLightPosition({
            x: BoardHelper.RankIndex(squareIndex),
            y: BoardHelper.FileIndex(squareIndex),
        });
    };

    const startMovingPiece = (e: ThreeMouseEvent, target: number) => {
        if (selected && target) {
            setTargeted(target);
            setStep(getStep(selected, target, board.IsWhiteToMove));
            return;
        }
        setTargeted(null);
    };

    const finishMovingPiece = (start: number | null, target: number | null, flag: number | null) => {
        if (!target && !start) return;

        const str = MoveUtility.GetMoveNameSAN(new Move(Number(start), Number(target), Number(flag)), board);

        if (setMove) {
            setMove(str);
        }

        board.MakeMove(new Move(Number(start), Number(target), Number(flag)), false);

        setSelected(null);
        setTargeted(null);
        setPrevSelected(null);
        setStep(null);
        setTurn(1 - turn);
        if(setTurning){
            setTurning(1 - turn);
        }
        if(setMoving){
            setMoving(null);
        }
    };

    const getStep = (start: number, target: number, isWhite: boolean) => {
        const movingTo = {
            x: BoardHelper.RankIndex(Number(target)) - BoardHelper.RankIndex(Number(start)),
            y: BoardHelper.FileIndex(Number(target)) - BoardHelper.FileIndex(Number(start)),
        };

        // if(!isWhite){
        //     movingTo.y = movingTo.y * -1;
        // }

        return movingTo;
    };

    useEffect(() => {
        const gameResult = GameResult.GetGameState(board);

        if(setMove){
            return;
        }

        if (gameResult) {
            if (
                gameResult === GameResult.GameResult.Stalemate ||
                gameResult === GameResult.GameResult.InsufficientMaterial
            ) {
                alert("Stalement | Insu");
            }

            if (gameResult === GameResult.GameResult.Repetition) {
                alert("Repetition");
            }

            if (
                gameResult === GameResult.GameResult.WhiteIsMated ||
                gameResult === GameResult.GameResult.BlackIsMated
            ) {
                alert("Game End");
            }
        }
        return;
    }, [turn]);

    useEffect(() => {
        if(moving && moving !== null){
            setSelected(moving.StartSquare());
            setTargeted(moving.TargetSquare());
            setStep(getStep(moving.StartSquare(), moving.TargetSquare(), board.IsWhiteToMove));
        }
    }, [moving])

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
                    position={[redLightPosition.y, 1, redLightPosition.x]}
                />
                {board.Square.map((square, i) => {
                    const file = BoardHelper.FileIndex(i);
                    const rank = BoardHelper.RankIndex(i);
                    const bg = (file + rank) % 2 === 0 ? `white` : `black`;
                    const isHightLight = IsHightLigt(board, selected, i);
                    const wasSelected = prevSelected === i;
                    const isSelected = selected && selected === i ? true : false;
                    let canMoveHere: Position | null = null;

                    if (isHightLight !== null) {
                        canMoveHere = {
                            x: BoardHelper.RankIndex(isHightLight.target),
                            y: BoardHelper.FileIndex(isHightLight.target),
                        };
                    }

                    const pieceIsBeingReplaced =
                        selected &&
                        targeted &&
                        board.Square[targeted] !== Piece.PieceType.None &&
                        checkIfPositionsMatch(
                            { x: BoardHelper.FileIndex(i), y: BoardHelper.RankIndex(i) },
                            {
                                x: BoardHelper.FileIndex(Number(targeted)),
                                y: BoardHelper.RankIndex(Number(targeted)),
                            },
                        )
                            ? true
                            : false;

                    const handleClick = (e: ThreeMouseEvent) => {
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
                        isSelected: turn === 0 ? isSelected : false,
                        wasSelected: wasSelected,
                        canMoveHere: canMoveHere,
                        movingTo:
                            selected !== null &&
                            targeted !== null &&
                            checkIfPositionsMatch(
                                { x: BoardHelper.FileIndex(i), y: BoardHelper.RankIndex(i) },
                                {
                                    x: BoardHelper.FileIndex(Number(selected)),
                                    y: BoardHelper.RankIndex(Number(selected)),
                                },
                            )
                                ? step
                                : null,
                        pieceIsBeingReplaced: pieceIsBeingReplaced,
                        finishMovingPiece: () => pieceIsBeingReplaced ? null :
                            finishMovingPiece(selected, targeted, isHightLight !== null ? isHightLight.flag : null),
                    };

                    return (
                        <group key={i}>
                            <TileModel
                                color={bg}
                                position={[rank, 0.25, file]}
                                onClick={handleClick}
                                canMoveHere={turn === 0 ? canMoveHere : null}
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

    // return <>

    // </>

    //     const BOARD_SCORES = {
    //         pawn: 100,
    //         knight: 300,
    //         bishop: 300,
    //         rook: 500,
    //         queen: 900,
    //         king: 0,
    //     };

    //     const END_SCORES = {
    //         WIN: 100,
    //         LOSE: -100,
    //         TIE: 0,
    //     };

    //     const EvaluationBoard = (vBoard: Board, player: Color, endType: EndGameType) => {
    //         try {
    //             const vb: Tile[] = vBoard.flat().filter((p: Tile) => p.piece !== null);
    //             let playerScore = 0;
    //             let opponentScore = 0;
    //             let totalScore = 0;
    //             let endScore = 0;
    //             for (const i in vb) {
    //                 const tile = vb[i];
    //                 if (tile.piece !== null) {
    //                     if (tile.piece.color === player) {
    //                         playerScore += BOARD_SCORES[tile.piece.type];
    //                     } else {
    //                         opponentScore -= BOARD_SCORES[tile.piece.type];
    //                     }
    //                 }
    //             }

    //             if(endType !== null){
    //                 endScore = endType === 'checkmate' ? END_SCORES.WIN : END_SCORES.LOSE;
    //             }
    //             totalScore = playerScore + opponentScore + endScore;
    //             console.log(player, "-", totalScore);
    //             return totalScore;
    //         } catch (e) {
    //             throw new Error((e as Error).message);
    //         }
    //     };

    //     const AvaiableMove = (vBoard: Board, color: Color) => {
    //         try {
    //             const avaialbe: PieceMove[] = [];
    //             if (!vBoard || !vBoard.flat()) {
    //                 return avaialbe;
    //             }

    //             const flat = vBoard.flat().filter((p: Tile) => p.piece !== null);
    //             for (const item in flat) {
    //                 const tile = flat[item];
    //                 if (tile.piece?.color === color) {
    //                     const pieceMove = movesForPiece({
    //                         piece: tile.piece,
    //                         board,
    //                         propagateDetectCheck: true,
    //                     });

    //                     if (pieceMove.length > 0) {
    //                         for (const i in pieceMove) {
    //                             avaialbe.push({
    //                                 tile: tile,
    //                                 move: pieceMove[i],
    //                             });
    //                         }
    //                     }
    //                 }
    //             }

    //             return avaialbe;
    //         } catch (error) {
    //             throw new Error((error as Error).message);
    //         }
    //     };

    //     const GenerateMove = (copyBoard: Board, nextMove: Move) => {
    //         try {
    //             const { x, y } = nextMove.newPosition;

    //             const makeMove: MovingTo = {
    //                 move: nextMove,
    //                 tile: copyBoard[y][x],
    //             };
    //             return makeMove;
    //         } catch (error) {
    //             throw new Error((error as Error).message);
    //         }
    //     };

    //     const MakeMove = (vBoard: Board, makeMove: MovingTo) => {
    //         try {
    //             if (!vBoard) return [[]] as Tile[][];
    //             const tile = makeMove.tile;
    //             if (!tile && !movingTo) return vBoard;
    //             const selectedTile = getTile(vBoard, makeMove.move.piece.position);
    //             if (!(selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile }))) {
    //                 const newBoard = copyBoard(vBoard);
    //                 if (!makeMove.move.piece) return vBoard;
    //                 const selectedTile = getTile(newBoard, makeMove.move.piece.position);
    //                 const tileToMoveTo = getTile(newBoard, tile.position);

    //                 if (!selectedTile || !tileToMoveTo) return vBoard;

    //                 if (isPawn(selectedTile.piece) || isKing(selectedTile.piece) || isRook(selectedTile.piece)) {
    //                     selectedTile.piece = { ...selectedTile.piece, hasMoved: true };
    //                 }

    //                 if (isPawn(selectedTile.piece) && makeMove.move.type === `captureEnPassant`) {
    //                     const latestMove = history[history.length - 1];
    //                     const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x];
    //                     enPassantTile.piece = null;
    //                 }

    //                 if (makeMove.move.castling) {
    //                     const rookTile =
    //                         newBoard[makeMove.move.castling.rook.position.y][makeMove.move.castling.rook.position.x];
    //                     const rookTileToMoveTo =
    //                         newBoard[makeMove.move.castling.rookNewPosition.y][makeMove.move.castling.rookNewPosition.x];
    //                     if (!isRook(rookTile.piece)) return vBoard;

    //                     rookTileToMoveTo.piece = {
    //                         ...rookTile.piece,
    //                         hasMoved: true,
    //                         position: rookTileToMoveTo.position,
    //                     };
    //                     rookTile.piece = null;
    //                 }

    //                 tileToMoveTo.piece = selectedTile.piece ? { ...selectedTile.piece, position: tile.position } : null;
    //                 selectedTile.piece = null;
    //                 return newBoard;
    //             } else {
    //                 const newBoard = copyBoard(vBoard);
    //                 const tileToMoveTo = getTile(newBoard, tile.position) as Tile;

    //                 selectedTile.piece.type = `queen`;
    //                 selectedTile.piece.id = selectedTile.piece.id + 2;
    //                 tileToMoveTo.piece = selectedTile.piece ? { ...selectedTile.piece, position: tile.position } : null;
    //                 selectedTile.piece = null;
    //                 return newBoard;
    //             }
    //         } catch (error) {
    //             return [[]] as Tile[][];
    //         }
    //     };

    //     const Minimax = async (
    //         fen: Board,
    //         depth: number,
    //         alpha: number,
    //         beta: number,
    //         maximizingPlayer: boolean,
    //         player: Color,
    //     ) => {
    //         try {
    //             let avaiMove = [] as PieceMove[];
    //             const detect = detectGameOver(fen, player) as EndGameType;
    //             const opponentPlayer = player === 'white' ? 'black' : 'white';
    //             if (maximizingPlayer) {
    //                 avaiMove = AvaiableMove(fen, player);
    //             } else {
    //                 avaiMove = AvaiableMove(fen, opponentPlayer);
    //             }

    //             if (depth === 0 || detect !== null || avaiMove.length === 0) {

    //                 return {
    //                     bestMove: null,
    //                     value: EvaluationBoard(fen, maximizingPlayer ? player : opponentPlayer, detect),
    //                 } as MinimaxMove;
    //             }

    //             if (maximizingPlayer) {
    //                 let maxEval = {
    //                     bestMove: null,
    //                     value: Number.NEGATIVE_INFINITY,
    //                 } as MinimaxMove;
    //                 for (const i in avaiMove) {
    //                     const move = GenerateMove(fen, avaiMove[i].move);
    //                     const newBoard = MakeMove(fen, move) as Board;
    //                     const evalu = (await Minimax(
    //                         newBoard,
    //                         depth - 1,
    //                         alpha,
    //                         beta,
    //                         !maximizingPlayer,
    //                         player,
    //                     )) as MinimaxMove;

    //                     if (maxEval.value < evalu.value) {
    //                         maxEval = {
    //                             bestMove: move,
    //                             value: evalu.value,
    //                         };
    //                     }

    //                     alpha = Math.max(evalu.value, alpha);

    //                     if (beta <= alpha) {
    //                         break;
    //                     }
    //                 }
    //                 return maxEval;
    //             } else {
    //                 let minEval = {
    //                     bestMove: null,
    //                     value: Number.POSITIVE_INFINITY,
    //                 } as MinimaxMove;
    //                 for (const i in avaiMove) {
    //                     const move = GenerateMove(fen, avaiMove[i].move);
    //                     const newBoard = MakeMove(fen, move) as Board;
    //                     const evalu = (await Minimax(
    //                         newBoard,
    //                         depth - 1,
    //                         alpha,
    //                         beta,
    //                         !maximizingPlayer,
    //                         player,
    //                     )) as MinimaxMove;
    //                     if (minEval.value > evalu.value) {
    //                         minEval = {
    //                             bestMove: move,
    //                             value: evalu.value,
    //                         };

    //                     }

    //                     beta = Math.min(evalu.value, beta);

    //                     if (beta <= alpha) {
    //                         break;
    //                     }
    //                 }
    //                 return minEval;
    //             }
    //         } catch (error) {
    //             console.log((error as Error).message);
    //             throw new Error((error as Error).message);
    //         }
    //     };

    //     useEffect(() => {
    //         if (turn === 'black') {
    //             const startTime = performance.now();
    //             Minimax(board, 4, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, 'black').then((bestMove) => {
    //                 console.log('Best: ', bestMove);
    //                 const gamecoreMove = (bestMove as MinimaxMove).bestMove as MovingTo;
    //                 setMovingTo(gamecoreMove);
    //                 const endTime = performance.now();
    //                 console.log('Time: ', (endTime - startTime) / 1000);
    //                 console.log('Count: ', count);
    //             });
    //         }
    //     }, [board]);

    //     const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
    //         e.stopPropagation();
    //         const isPlayersTurn = turn === `white`;
    //         if (!isPlayersTurn || !gameStarted) return;
    //         if (!tile?.piece?.type && !selected) return;
    //         if (!tile?.piece) {
    //             setSelected(null);
    //             return;
    //         }

    //         setMovingTo(null);
    //         setMoves(movesForPiece({ piece: tile.piece, board, propagateDetectCheck: true }));
    //         setSelected(tile.piece);
    //         setLastSelected(tile);
    //         setRedLightPosition(tile.position);
    //     };

    //     const finishMovingPiece = (tile: Tile | null) => {
    //         if (!tile || !movingTo) return;
    //         const selectedTile = getTile(board, movingTo.move.piece.position);
    //         if (!(selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile }))) {
    //             setBoard((prev) => {
    //                 const newBoard = copyBoard(prev);
    //                 if (!movingTo.move.piece) return prev;
    //                 const selectedTile = getTile(newBoard, movingTo.move.piece.position);
    //                 const tileToMoveTo = getTile(newBoard, tile.position);

    //                 if (!selectedTile || !tileToMoveTo) return prev;

    //                 if (isPawn(selectedTile.piece) || isKing(selectedTile.piece) || isRook(selectedTile.piece)) {
    //                     selectedTile.piece = { ...selectedTile.piece, hasMoved: true };
    //                 }

    //                 if (isPawn(selectedTile.piece) && movingTo.move.type === `captureEnPassant`) {
    //                     const latestMove = history[history.length - 1];
    //                     const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x];
    //                     enPassantTile.piece = null;
    //                 }

    //                 if (movingTo.move.castling) {
    //                     const rookTile =
    //                         newBoard[movingTo.move.castling.rook.position.y][movingTo.move.castling.rook.position.x];
    //                     const rookTileToMoveTo =
    //                         newBoard[movingTo.move.castling.rookNewPosition.y][movingTo.move.castling.rookNewPosition.x];
    //                     if (!isRook(rookTile.piece)) return prev;

    //                     rookTileToMoveTo.piece = {
    //                         ...rookTile.piece,
    //                         hasMoved: true,
    //                         position: rookTileToMoveTo.position,
    //                     };
    //                     rookTile.piece = null;
    //                 }

    //                 tileToMoveTo.piece = selectedTile.piece ? { ...selectedTile.piece, position: tile.position } : null;
    //                 selectedTile.piece = null;
    //                 return newBoard;
    //             });

    //             setTurn((t: Color) => {
    //                 if (t === `white`) return `black`;
    //                 else return `white`;
    //             });

    //             setMovingTo(null);
    //             setMoves([]);
    //             setSelected(null);
    //             setLastSelected(null);
    //         } else {
    //             setTile(tile);
    //             if (`white` === turn) {
    //                 // setShowPromotionDialog(true);
    //             }
    //         }
    //     };

    //     const startMovingPiece = (e: ThreeMouseEvent, tile: Tile, nextTile: Move) => {
    //         e.stopPropagation();
    //         const newMovingTo: MovingTo = {
    //             move: nextTile,
    //             tile: tile,
    //         };

    //         setMovingTo(newMovingTo);
    //     };

    //     return (
    //         <>
    //             <group position={[-4, -0.5, -4]}>
    //                 {/* <mesh position={[3.5, 5, 3.5]}>
    //     <boxGeometry args={[1, 1, 1]} />
    //     <meshStandardMaterial color="#d886b7" />
    //   </mesh> */}
    //                 <OrbitControls maxDistance={25} minDistance={7} enableZoom={true} enablePan={false} />
    //                 <pointLight
    //                     shadow-mapSize={[2048, 2048]}
    //                     castShadow
    //                     position={[3.5, 10, 3.5]}
    //                     intensity={0.65}
    //                     color="#ffe0ec"
    //                 />
    //                 <hemisphereLight intensity={0.5} color="#ffa4a4" groundColor="#d886b7" />

    //                 <animated.pointLight intensity={1} color="red" position={[redLightPosition.x, 1, redLightPosition.y]} />
    //                 {board.map((row, i) => {
    //                     return row.map((tile, j) => {
    //                         const bg = `${(i + j) % 2 === 0 ? `white` : `black`}`;
    //                         const isSelected = tile.piece && selected?.getId() === tile.piece.getId();

    //                         const canMoveHere = checkIfSelectedPieceCanMoveHere({
    //                             tile,
    //                             moves,
    //                             selected,
    //                         });

    //                         const tileId = tile.piece?.getId();
    //                         const pieceIsBeingReplaced =
    //                             movingTo?.move.piece && tile.piece && movingTo?.move.capture
    //                                 ? tileId === createId(movingTo?.move.capture)
    //                                 : false;
    //                         const rookCastled = movingTo?.move.castling?.rook;
    //                         const isBeingCastled = rookCastled && createId(rookCastled) === tile.piece?.getId();

    //                         const handleClick = (e: ThreeMouseEvent) => {
    //                             if (movingTo) {
    //                                 return;
    //                             }

    //                             const tileContainsOtherPlayersPiece = tile.piece && tile.piece?.color !== turn;

    //                             if (tileContainsOtherPlayersPiece && !canMoveHere) {
    //                                 setSelected(null);
    //                                 return;
    //                             }

    //                             canMoveHere ? startMovingPiece(e, tile, canMoveHere) : selectThisPiece(e, tile);
    //                         };

    //                         const props: ModelProps = {
    //                             position: [j, 0.5, i],
    //                             scale: [0.5, 0.5, 0.5],
    //                             color: tile.piece?.color || `white`,
    //                             onClick: handleClick,
    //                             isSelected: isSelected ? true : false,
    //                             wasSelected: lastSelected ? lastSelected?.piece?.getId() === tile.piece?.getId() : false,
    //                             canMoveHere: canMoveHere?.newPosition ?? null,
    //                             movingTo:
    //                                 checkIfPositionsMatch(tile.position, movingTo?.move.piece?.position) && movingTo
    //                                     ? movingTo.move.steps
    //                                     : isBeingCastled
    //                                     ? movingTo.move.castling?.rookSteps ?? null
    //                                     : null,
    //                             pieceIsBeingReplaced: pieceIsBeingReplaced ? true : false,
    //                             finishMovingPiece: () =>
    //                                 isBeingCastled ? null : finishMovingPiece(movingTo?.tile ?? null),
    //                         };

    //                         const pieceId = tile.piece?.getId() ?? `empty-${j}-${i}`;

    //                         return (
    //                             <group key={`${j}-${i}`}>
    //                                 <TileModel
    //                                     color={bg}
    //                                     position={[j, 0.25, i]}
    //                                     onClick={handleClick}
    //                                     canMoveHere={canMoveHere?.newPosition ?? null}
    //                                 />
    //                                 <MeshWrapper key={pieceId} {...props}>
    //                                     {tile.piece?.type === `pawn` && <WhitePawnModel />}
    //                                     {tile.piece?.type === `rook` && <WhiteRookModel />}
    //                                     {tile.piece?.type === `knight` && <WhiteKnightModel />}
    //                                     {tile.piece?.type === `bishop` && <WhiteBishopModel />}
    //                                     {tile.piece?.type === `queen` && <WhiteQueenModel />}
    //                                     {tile.piece?.type === `king` && <WhiteKingModel />}
    //                                     {/*
    //                                 {tile.piece?.type === `pawn` && tile.piece?.color === `black` && <BlackPawnModel />}
    //                                 {tile.piece?.type === `rook` && tile.piece?.color === `black` && <BlackRookModel />}
    //                                 {tile.piece?.type === `knight` && tile.piece?.color === `black` && <BlackKnightModel />}
    //                                 {tile.piece?.type === `bishop` && tile.piece?.color === `black` && <BlackBishopModel />}
    //                                 {tile.piece?.type === `queen` && tile.piece?.color === `black` && <BlackQueenModel />}
    //                                 {tile.piece?.type === `king` && tile.piece?.color === `black` && <BlackKingModel />} */}
    //                                 </MeshWrapper>
    //                             </group>
    //                         );
    //                     });
    //                 })}
    //             </group>
    //         </>
    //     );
};
