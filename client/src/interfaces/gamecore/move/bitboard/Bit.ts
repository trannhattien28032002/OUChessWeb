import BitBoardUtility, { Shift } from "src/interfaces/gamecore/move/bitboard/BitBoardUtility";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";

export const FileA = BigInt("0x101010101010101");

export const WhiteKingsideMask =
    (BigInt(1) << BigInt(BoardHelper.SquareNames.f1)) | (BigInt(1) << BigInt(BoardHelper.SquareNames.g1));
export const BlackKingsideMask =
    (BigInt(1) << BigInt(BoardHelper.SquareNames.f8)) | (BigInt(1) << BigInt(BoardHelper.SquareNames.g8));
export const WhiteKingsideMask2 =
    (BigInt(1) << BigInt(BoardHelper.SquareNames.d1)) | (BigInt(1) << BigInt(BoardHelper.SquareNames.c1));
export const BlackKingsideMask2 =
    (BigInt(1) << BigInt(BoardHelper.SquareNames.d8)) | (BigInt(1) << BigInt(BoardHelper.SquareNames.c8));
export const WhiteQueensideMask = WhiteKingsideMask2 | (BigInt(1) << BigInt(BoardHelper.SquareNames.b1));
export const BlackQueensideMask = BlackKingsideMask2 | (BigInt(1) << BigInt(BoardHelper.SquareNames.b8));

class Bits {
    static initialize = false;

    static WhitePassedPawnMask: bigint[];
    static BlackPassedPawnMask: bigint[];

    static WhitePawnSupportMask: bigint[];
    static BlackPawnSupportMask: bigint[];

    static FileMask: bigint[];
    static AdjacentFileMasks: bigint[];

    static KingSafetyMask: bigint[];

    static WhiteForwardFileMask: bigint[];
    static BlackForwardFileMask: bigint[];

    static TripleFileMask: bigint[];

    static initialized() {
        if (!this.initialize) {
            this.FileMask = Array<bigint>(8);
            this.AdjacentFileMasks = Array<bigint>(8);

            for (let i = 0; i < 8; i++) {
                const m = BigInt(i);

                this.FileMask[i] = FileA << m;
                const left = m > 0 ? FileA << (m - BigInt(1)) : BigInt(0);
                const right = m < 7 ? FileA << (m + BigInt(1)) : BigInt(0);
                this.AdjacentFileMasks[i] = left | right;
            }

            this.TripleFileMask = Array<bigint>(8);
            for (let i = 0; i < 8; i++) {
                const clampedFile = i < 1 ? 1 : i > 6 ? 6 : i;
                this.TripleFileMask[i] = this.FileMask[clampedFile] | this.AdjacentFileMasks[clampedFile];
            }

            this.WhitePassedPawnMask = Array<bigint>(64);
            this.BlackPassedPawnMask = Array<bigint>(64);
            this.WhitePawnSupportMask = Array<bigint>(64);
            this.BlackPawnSupportMask = Array<bigint>(64);
            this.WhiteForwardFileMask = Array<bigint>(64);
            this.BlackForwardFileMask = Array<bigint>(64);

            for (let square = 0; square < 64; square++) {
                const file = BoardHelper.FileIndex(square);
                const rank = BoardHelper.RankIndex(square);
                const adjacentFiles =
                    (FileA << BigInt(Math.max(0, file - 1))) | (FileA << BigInt(Math.min(7, file + 1)));

                const whiteForwardMask = ~(BigInt("18446744073709551615") >> BigInt(64 - 8 * (rank + 1)));
                const blackForwardMask = (BigInt(1) << BigInt(8 * rank)) - BigInt(1);

                this.WhitePassedPawnMask[square] = (FileA << BigInt(file) | adjacentFiles) & whiteForwardMask;
                this.BlackPassedPawnMask[square] = (FileA << BigInt(file) | adjacentFiles) & blackForwardMask;

                const adjacent =
                    ((BigInt(1) << BigInt(square - 1)) | (BigInt(1) << BigInt(square + 1))) & adjacentFiles;
                this.WhitePawnSupportMask[square] = adjacent | Shift(adjacent, -8);
                this.BlackPawnSupportMask[square] = adjacent | Shift(adjacent, +8);

                this.WhiteForwardFileMask[square] = whiteForwardMask & this.FileMask[file];
                this.BlackForwardFileMask[square] = blackForwardMask & this.FileMask[file];
            }

            this.KingSafetyMask = Array<bigint>(64);
            for (let i = 0; i < 64; i++) {
                this.KingSafetyMask[i] = BitBoardUtility.KingMoves[i] | (BigInt(1) << BigInt(i));
            }

            this.initialize = true;
        }
    }
}

export default Bits;
