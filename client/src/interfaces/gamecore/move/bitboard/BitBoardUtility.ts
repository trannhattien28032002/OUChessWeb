export const FileA = BigInt("0x101010101010101");

export const Rank1 = BigInt("0b11111111");
export const Rank2 = Rank1 << BigInt(8);
export const Rank3 = Rank2 << BigInt(8);
export const Rank4 = Rank3 << BigInt(8);
export const Rank5 = Rank4 << BigInt(8);
export const Rank6 = Rank5 << BigInt(8);
export const Rank7 = Rank6 << BigInt(8);
export const Rank8 = Rank7 << BigInt(8);

export const notAFile = ~FileA;
export const notHFile = ~(FileA << BigInt(7));

export const PopLSB = (b: bigint): { i: number; b: bigint } => {
    let nOz = 0;
    if (b === BigInt(0)) {
        nOz = 64; // If num is 0, there are 64 trailing zeros
    }

    let mask = BigInt(1);
    let i = BigInt(0);
    while ((b & mask) === BigInt(0)) {
        mask <<= BigInt(1);
        i++;
    }
    // Find the position of the least significant set bit
    b = BigInt(b) & BigInt(b - BigInt(1));
    nOz = i !== BigInt(0) ? Number(i) : nOz;

    return {
        i: nOz,
        b: b,
    };
};

export const SetSquare = (bitboard: bigint, squareIndex: number): bigint => {
    return BigInt(bitboard) | (BigInt(1) << BigInt(squareIndex));
};

export const ClearSquare = (bitboard: bigint, squareIndex: number): bigint => {
    return bitboard & ~(BigInt(1) << BigInt(squareIndex));
};

export const ToggleSquare = (bitboard: bigint, squareIndex: number): bigint => {
    return BigInt(bitboard) ^ (BigInt(1) << BigInt(squareIndex));
};

export const ToggleSquares = (bitboard: bigint, squareA: number, squareB: number): bigint => {
    return (BigInt(bitboard) ^ (BigInt(1) << BigInt(squareA))) | (BigInt(1) << BigInt(squareB));
};

export const ContainsSquare = (bitboard: bigint, squareIndex: number): boolean => {
    return ((bitboard >> BigInt(squareIndex)) & BigInt(1)) !== BigInt(0);
};

export const PawnAttacks = (pawnBitboard: bigint, isWhite: boolean): bigint => {
    if (isWhite) {
        return ((pawnBitboard << BigInt(9)) & notAFile) | ((pawnBitboard << BigInt(7)) & notHFile);
    }

    return ((pawnBitboard >> BigInt(7)) & notAFile) | ((pawnBitboard >> BigInt(9)) & notHFile);
};

export const Shift = (bitboard: bigint, numSquaresToShift: number): bigint => {
    if (numSquaresToShift > 0) {
        return BigInt(bitboard) << BigInt(numSquaresToShift);
    } else {
        return BigInt(bitboard) >> BigInt(-numSquaresToShift);
    }
};

class BitBoardUtility {
    static initialize = false;
    static KnightAttacks: bigint[];
    static KingMoves: bigint[];
    static WhitePawnAttacks: bigint[];
    static BlackPawnAttacks: bigint[];

    static initalized() {
        if (!this.initialize) {
            this.KnightAttacks = Array<bigint>(64).fill(BigInt(0));
            this.KingMoves = Array<bigint>(64).fill(BigInt(0));
            this.WhitePawnAttacks = Array<bigint>(64).fill(BigInt(0));
            this.BlackPawnAttacks = Array<bigint>(64).fill(BigInt(0));

            const orthoDir = [
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 0 },
                { x: 0, y: -1 },
            ];
            const diagDir = [
                { x: -1, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: 1 },
                { x: 1, y: -1 },
            ];
            const knightJumps = [
                { x: -2, y: -1 },
                { x: -2, y: 1 },
                { x: -1, y: 2 },
                { x: 1, y: 2 },
                { x: 2, y: 1 },
                { x: 2, y: -1 },
                { x: 1, y: -2 },
                { x: -1, y: -2 },
            ];

            const ProcessSquare = (x: number, y: number) => {
                const squareIndex = y * 8 + x;

                const ValidSquareIndex = (x: number, y: number): { isValid: boolean; value: number } => {
                    const value = y * 8 + x;
                    const valid = x >= 0 && x < 8 && y >= 0 && y < 8;

                    return {
                        isValid: valid,
                        value: value,
                    };
                };

                for (let dirIndex = 0; dirIndex < 4; dirIndex++) {
                    for (let dst = 1; dst < 8; dst++) {
                        const orthoX = x + orthoDir[dirIndex].x * dst;
                        const orthoY = y + orthoDir[dirIndex].y * dst;
                        const diagX = x + diagDir[dirIndex].x * dst;
                        const diagY = y + diagDir[dirIndex].y * dst;

                        const orthoTargetIndex = ValidSquareIndex(orthoX, orthoY);

                        if (orthoTargetIndex.isValid) {
                            if (dst === 1) {
                                this.KingMoves[squareIndex] |= BigInt(1) << BigInt(orthoTargetIndex.value);
                            }
                        }

                        const diagTargetIndex = ValidSquareIndex(diagX, diagY);
                        if (diagTargetIndex.isValid) {
                            if (dst === 1) {
                                this.KingMoves[squareIndex] |= BigInt(1) << BigInt(diagTargetIndex.value);
                            }
                        }

                        for (let i = 0; i < knightJumps.length; i++) {
                            const knightX = x + knightJumps[i].x;
                            const knightY = y + knightJumps[i].y;
                            const knightTargetSquare = ValidSquareIndex(knightX, knightY);
                            if (knightTargetSquare.isValid) {
                                this.KnightAttacks[squareIndex] |= BigInt(1) << BigInt(knightTargetSquare.value);
                            }
                        }

                        const whitePawnRight = ValidSquareIndex(x + 1, y + 1);
                        if (whitePawnRight.isValid) {
                            this.WhitePawnAttacks[squareIndex] |= BigInt(BigInt(1) << BigInt(whitePawnRight.value));
                        }

                        const whitePawnLeft = ValidSquareIndex(x - 1, y + 1);
                        if (whitePawnLeft.isValid) {
                            this.WhitePawnAttacks[squareIndex] |= BigInt(1) << BigInt(whitePawnLeft.value);
                        }

                        const blackPawnAttackRight = ValidSquareIndex(x + 1, y - 1);
                        if (blackPawnAttackRight.isValid) {
                            this.WhitePawnAttacks[squareIndex] |= BigInt(1) << BigInt(blackPawnAttackRight.value);
                        }

                        const blackPawnAttackLeft = ValidSquareIndex(x - 1, y - 1);
                        if (blackPawnAttackLeft.isValid) {
                            this.WhitePawnAttacks[squareIndex] |= BigInt(1) << BigInt(blackPawnAttackLeft.value);
                        }
                    }
                }
            };

            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    ProcessSquare(x, y);
                }
            }

            this.initialize = true;
        }
    }
}

export default BitBoardUtility;
