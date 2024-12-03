import * as PrecomputedMagics from 'src/interfaces/gamecore/move/magic/PrecomputedMagics';
import * as MagicHelper from 'src/interfaces/gamecore/move/magic/MagicHelper';
class Magic {
    static initialized = false;

    static RookMask: bigint[];
    static BishopMask: bigint[];

    static RookAttacks: bigint[][];
    static BishopAttacks: bigint[][];

    public static GetRookAttacks = (square: number, blockers: bigint): bigint => {
        const key =
            (((blockers & this.RookMask[square]) * PrecomputedMagics.RookMagics[square])) >>
            BigInt(PrecomputedMagics.RookShifts[square]);
        return this.RookAttacks[square][Number(key)];
    };

    public static GetBishopAttacks = (square: number, blockers: bigint): bigint => {
        const key =
            ((blockers & this.BishopMask[square]) * PrecomputedMagics.BishopMagics[square]) >>
            BigInt(PrecomputedMagics.BishopShifts[square]);
        return this.BishopAttacks[square][Number(key)];
    };

    public static GetSliderAttacks = (square: number, blockers: bigint, ortho: boolean): bigint => {
        return ortho ? this.GetRookAttacks(square, blockers) : this.GetBishopAttacks(square, blockers);
    };

    public static initialize() {
        if (!this.initialized) {
            this.RookMask = Array<bigint>(64);
            this.BishopMask = Array<bigint>(64);

            for (let squareIndex = 0; squareIndex < 64; squareIndex++) {
                this.RookMask[squareIndex] = MagicHelper.CreateMovementMask(squareIndex, true);
                this.BishopMask[squareIndex] = MagicHelper.CreateMovementMask(squareIndex, false);
            }

            this.RookAttacks = Array.from({ length: 64 }, () => Array<bigint>(64).fill(BigInt(0)));
            this.BishopAttacks = Array.from({ length: 64 }, () => Array<bigint>(64).fill(BigInt(0)));

            const CreateTable = (square: number, rook: boolean, magic: bigint, leftShift: number): bigint[] => {
                const numBits = 64 - leftShift;
                const lookupSize = 1 << numBits;
                const table = Array<bigint>(lookupSize).fill(BigInt(0));
                const movementMask = MagicHelper.CreateMovementMask(square, rook);
                const blockersPatterns = MagicHelper.CreateAllBlockerBitboards(movementMask);
                for (const i in blockersPatterns) {
                    const pattern = blockersPatterns[i];
                    const index = BigInt(BigInt(pattern) * BigInt(magic)) >> BigInt(leftShift);
                    const moves = MagicHelper.LegalMoveBitboardFromBlockers(square, pattern, rook);
                    table[Number(index)] = moves;
                }
                
                return table;
            };

            for (let i = 0; i < 64; i++) {
                this.RookAttacks[i] = CreateTable(
                    i,
                    true,
                    PrecomputedMagics.RookMagics[i],
                    PrecomputedMagics.RookShifts[i],
                );
                this.BishopAttacks[i] = CreateTable(
                    i,
                    false,
                    PrecomputedMagics.BishopMagics[i],
                    PrecomputedMagics.BishopShifts[i],
                );
            }

            this.initialized = true;
        }
    }
}

export default Magic;
