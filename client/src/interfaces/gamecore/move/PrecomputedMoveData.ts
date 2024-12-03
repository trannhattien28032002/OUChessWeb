import Coord from "src/interfaces/gamecore/board/Coord";
import Board from "src/interfaces/gamecore/board/Board";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";

class PrecomputedMoveData {
    static initialize = false;

    static alignMask: bigint[][];
    static dirRayMask: bigint[][];

    static directionOffsets = [8, -8, -1, 1, 7, -7, 9, -9];

    static dirOffsets2D = [
        new Coord(0, 1),
        new Coord(0, -1),
        new Coord(-1, 0),
        new Coord(1, 0),
        new Coord(-1, 1),
        new Coord(1, -1),
        new Coord(1, 1),
        new Coord(-1, -1),
    ];

    static numSquaresToEdge: number[][];

    static knightMoves: number[][];
    static kingMoves: number[][];

    static pawnAttackDirections = [
        [4, 6],
        [7, 5],
    ];

    static pawnAttacksWhite: number[][];
    static pawnAttacksBlack: number[][];
    static directionLookUp: number[];

    static kingAttackBitboards: bigint[];
    static knightAttackBitboards: bigint[];
    static pawnAttackBitboards: bigint[][];

    static rookMoves: bigint[];
    static bishopMoves: bigint[];
    static queenMoves: bigint[];

    static OrthogonalDistance: number[][];
    static kingDistance: number[][];
    static CentreManhattanDistance: number[];

    static NumRookMovesToReachSquare = (startSquare: number, targetSquare: number): number => {
        return this.OrthogonalDistance[startSquare][targetSquare];
    };

    static NumKingMovesToReachSquare = (startSquare: number, targetSquare: number): number => {
        return this.kingDistance[startSquare][targetSquare];
    };

    static initialized() {
        if (!this.initialize) {
            this.pawnAttacksWhite = Array<number>(64).map(() => [] as number[]);
            this.pawnAttacksBlack = Array<number>(64).map(() => [] as number[]);
            this.numSquaresToEdge = Array<number>(8).map(() => [] as number[]);
            this.knightMoves = Array<number>(64).map(() => [] as number[]);
            this.kingMoves = Array<number>(64).map(() => [] as number[]);

            this.rookMoves = Array<bigint>(64).fill(BigInt(0));
            this.bishopMoves = Array<bigint>(64).fill(BigInt(0));
            this.queenMoves = Array<bigint>(64).fill(BigInt(0));

            const allKnightJumps = [15, 17, -17, -15, 10, -6, 6, -10];
            this.knightAttackBitboards = Array<bigint>(64).fill(BigInt(0));
            this.kingAttackBitboards = Array<bigint>(64).fill(BigInt(0));
            this.pawnAttackBitboards = Array<bigint>(64).map(() => [] as bigint[]);

            for (let squareIndex = 0; squareIndex < 64; squareIndex++) {
                const y = squareIndex / 8;
                const x = squareIndex - y * 8;

                const north = 7 - y;
                const south = y;
                const west = x;
                const east = 7 - x;

                this.numSquaresToEdge[squareIndex] = Array<number>(8);
                this.numSquaresToEdge[squareIndex][0] = north;
                this.numSquaresToEdge[squareIndex][1] = south;
                this.numSquaresToEdge[squareIndex][2] = west;
                this.numSquaresToEdge[squareIndex][3] = east;
                this.numSquaresToEdge[squareIndex][4] = Math.min(north, west);
                this.numSquaresToEdge[squareIndex][5] = Math.min(south, east);
                this.numSquaresToEdge[squareIndex][6] = Math.min(north, east);
                this.numSquaresToEdge[squareIndex][7] = Math.min(south, west);

                const legalKnightJumps = Array<number>();
                let knightBitBoard = BigInt(0);
                for (const i in allKnightJumps) {
                    const knightJumpDelta = allKnightJumps[i];
                    const knightJumpSquare = squareIndex + knightJumpDelta;
                    if (knightJumpSquare >= 0) {
                        const knightSquareY = knightJumpSquare / 8;
                        const knightSquareX = knightJumpSquare - knightSquareY * 8;

                        const maxCoordMoveDst = Math.max(Math.abs(x - knightSquareX), Math.abs(y - knightSquareY));
                        if (maxCoordMoveDst === 2) {
                            legalKnightJumps.push(knightJumpSquare);
                            knightBitBoard |= BigInt(0) << BigInt(knightJumpSquare);
                        }
                    }
                }
                this.knightMoves[squareIndex] = legalKnightJumps;
                this.knightAttackBitboards[squareIndex] = knightBitBoard;

                const legalKingMoves = Array<number>();
                for (const i in this.directionOffsets) {
                    const kingMoveDelta = this.directionOffsets[i];
                    const kingMoveSquare = squareIndex + kingMoveDelta;
                    if (kingMoveSquare >= 0 && kingMoveSquare < 64) {
                        const kingSquareY = kingMoveSquare / 8;
                        const kingSquareX = kingMoveDelta - kingSquareY * 8;

                        const maxCoordMoveDst = Math.max(Math.abs(x - kingSquareX), Math.abs(y - kingSquareY));
                        if (maxCoordMoveDst === 1) {
                            legalKingMoves.push(kingMoveSquare);
                            this.kingAttackBitboards[squareIndex] |= BigInt(1) << BigInt(kingMoveSquare);
                        }
                    }
                }

                this.kingMoves[squareIndex] = legalKingMoves;

                const pawnCapturesWhite = Array<number>();
                const pawnCapturesBlack = Array<number>();

                this.pawnAttackBitboards[squareIndex] = Array<bigint>(2).fill(BigInt(0));
                if (x > 0) {
                    if (y < 7) {
                        pawnCapturesWhite.push(squareIndex + 7);
                        this.pawnAttackBitboards[squareIndex][Board.WhiteIndex] |= BigInt(1) << BigInt(squareIndex + 7);
                    }
                    if (y > 0) {
                        pawnCapturesBlack.push(squareIndex - 9);
                        this.pawnAttackBitboards[squareIndex][Board.BlackIndex] |= BigInt(1) << BigInt(squareIndex - 9);
                    }
                }

                if (x < 7) {
                    if (y < 7) {
                        pawnCapturesWhite.push(squareIndex + 9);
                        this.pawnAttackBitboards[squareIndex][Board.WhiteIndex] |= BigInt(1) << BigInt(squareIndex + 9);
                    }
                    if (y > 0) {
                        pawnCapturesBlack.push(squareIndex - 7);
                        this.pawnAttackBitboards[squareIndex][Board.BlackIndex] |= BigInt(1) << BigInt(squareIndex - 7);
                    }
                }

                this.pawnAttacksWhite[squareIndex] = pawnCapturesWhite;
                this.pawnAttacksBlack[squareIndex] = pawnCapturesBlack;

                for (let directionIndex = 0; directionIndex < 4; directionIndex++) {
                    const currentDirOffset = this.directionOffsets[directionIndex];
                    for (let n = 0; n < this.numSquaresToEdge[squareIndex][directionIndex]; n++) {
                        const targetSquare = squareIndex + currentDirOffset * (n + 1);
                        this.rookMoves[squareIndex] |= BigInt(1) << BigInt(targetSquare);
                    }
                }

                for (let directionIndex = 4; directionIndex < 8; directionIndex++) {
                    const currentDirOffset = this.directionOffsets[directionIndex];
                    for (let n = 0; n < this.numSquaresToEdge[squareIndex][directionIndex]; n++) {
                        const targetSquare = squareIndex + currentDirOffset * (n + 1);
                        this.bishopMoves[squareIndex] |= BigInt(1) << BigInt(targetSquare);
                    }
                }

                this.queenMoves[squareIndex] = this.rookMoves[squareIndex] | this.bishopMoves[squareIndex];
            }

            this.directionLookUp = Array<number>(127);
            for (let i = 0; i < 127; i++) {
                const offset = i - 63;
                const absOffset = Math.abs(offset);
                let absDir = 1;
                if (absOffset % 9 === 0) {
                    absDir = 9;
                } else if (absOffset % 8 === 0) {
                    absDir = 8;
                } else if (absOffset % 7 === 0) {
                    absDir = 7;
                }

                this.directionLookUp[i] = absDir * Math.sign(offset);
            }

            // Distance lookup
			this.OrthogonalDistance = Array.from({ length: 64 }, () => new Array(64).fill(0));
			this.kingDistance = Array.from({ length: 64 }, () => new Array(64).fill(0));
			this.CentreManhattanDistance = new Array<number>(64).fill(0);
			for (let squareA = 0; squareA < 64; squareA++)
			{
				const coordA: Coord = BoardHelper.CoordFromIndex(squareA);
				const fileDstFromCentre = Math.max(3 - coordA.fileIndex, coordA.fileIndex - 4);
				const rankDstFromCentre = Math.max(3 - coordA.rankIndex, coordA.rankIndex - 4);
				this.CentreManhattanDistance[squareA] = fileDstFromCentre + rankDstFromCentre;

				for (let squareB = 0; squareB < 64; squareB++)
				{

					const coordB: Coord = BoardHelper.CoordFromIndex(squareB);
					const rankDistance = Math.abs(coordA.rankIndex - coordB.rankIndex);
					const fileDistance = Math.abs(coordA.fileIndex - coordB.fileIndex);
					this.OrthogonalDistance[squareA][squareB] = fileDistance + rankDistance;
					this.kingDistance[squareA][squareB] = Math.max(fileDistance, rankDistance);
				}
			}

            this.alignMask = Array<bigint>(64)
                .fill(BigInt(0))
                .map(() => Array<bigint>(64).fill(BigInt(0)));
            for (let squareA = 0; squareA < 64; squareA++) {
                for (let squareB = 0; squareB < 64; squareB++) {
                    const cA = BoardHelper.CoordFromIndex(squareA);
                    const cB = BoardHelper.CoordFromIndex(squareB);
                    const delta = Coord.Subctract(cB, cA);
                    const dir = new Coord(Math.sign(delta.fileIndex), Math.sign(delta.rankIndex));

                    for (let i = -8; i < 8; i++) {
                        const coord = Coord.Add(BoardHelper.CoordFromIndex(squareA), Coord.multiply(dir, i));
                        if (coord.IsValidSquare()) {
                            this.alignMask[squareA][squareB] |=
                                BigInt(1) << BigInt(BoardHelper.IndexFromCoord(coord.fileIndex, coord.rankIndex));
                        }
                    }
                }
            }

            this.dirRayMask = Array<bigint>(8)
                .fill(BigInt(0))
                .map(() => Array<bigint>(64).fill(BigInt(0)));
            for (let dirIndex = 0; dirIndex < this.dirOffsets2D.length; dirIndex++) {
                for (let squareIndex = 0; squareIndex < 64; squareIndex++) {
                    const square = BoardHelper.CoordFromIndex(squareIndex);
                    for (let i = 0; i < 8; i++) {
                        const coord = Coord.Add(square, Coord.multiply(this.dirOffsets2D[dirIndex], i));
                        if (coord.IsValidSquare()) {
                            this.dirRayMask[dirIndex][squareIndex] |=
                                BigInt(1) << BigInt(BoardHelper.IndexFromCoord(coord.fileIndex, coord.rankIndex));
                        } else {
                            break;
                        }
                    }
                }
            }

            this.initialize = true;
        }
    }
}

export default PrecomputedMoveData;
