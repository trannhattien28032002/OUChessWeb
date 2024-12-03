import { PieceType } from "src/interfaces/gamecore/board/Piece";

export const MoveFlag = {
    NoFlag: 0b0000,
    EnPassantCaptureFlag: 0b0001,
    CastleFlag: 0b0010,
    PawnTwoUpFlag: 0b0011,
    PromoteToQueenFlag: 0b0100,
    PromoteToKnightFlag: 0b0101,
    PromoteToRookFlag: 0b0110,
    PromoteToBishopFlag: 0b0111,
};

export const MoveMask = {
    startSquareMask: 0b0000000000111111,
    targetSquareMask: 0b0000111111000000,
    flagMask: 0b1111000000000000,
};

class Move {
    // move value
    moveValue = 0;

    constructor(moveValue: number);
    constructor(startSquare: number, targetSquare: number);
    constructor(startSquare: number, targetSquare: number, flag: number);
    constructor(...myArray: [] | [number] | [number, number] | [number, number, number]) {
        if (myArray.length === 1) {
            this.moveValue = myArray[0];
        } else if (myArray.length === 2) {
            this.moveValue = myArray[0] | (myArray[1] << 6);
        } else if (myArray.length === 3) {
            this.moveValue = myArray[0] | (myArray[1] << 6) | (myArray[2] << 12);
        }
    }

    Value = (): number => {
        return this.moveValue;
    };

    IsNull = (): boolean => {
        return this.moveValue === 0;
    };

    StartSquare = (): number => {
        return this.moveValue & MoveMask.startSquareMask;
    };

    TargetSquare = (): number => {
        return (this.moveValue & MoveMask.targetSquareMask) >> 6;
    };

    MoveFlag = (): number => {
        return this.moveValue >> 12;
    };

    IsPromotion = (): boolean => {
        return this.MoveFlag() >= MoveFlag.PromoteToQueenFlag;
    };

    PromotionType = (): number => {
        switch (this.MoveFlag()) {
            case MoveFlag.PromoteToRookFlag:
                return PieceType.Rook;
            case MoveFlag.PromoteToBishopFlag:
                return PieceType.Bishop;
            case MoveFlag.PromoteToKnightFlag:
                return PieceType.Knight;
            case MoveFlag.PromoteToQueenFlag:
                return PieceType.Queen;
            default:
                return PieceType.None;
        }
    };

    static NullMove = () => {
        return new Move(0);
    };

    static SameMove = (a: Move, b: Move): boolean => {
        return a.moveValue === b.moveValue;
    };
}

export default Move;
