
export const GameStateSideMask = {
    ClearWhiteKingsideMask: 0b1110,
    ClearWhiteQueensideMask: 0b1101,
    ClearBlackKingsideMask : 0b1001,
    ClearBlackQueensideMask: 0b111
}

class GameState {
    capturedPieceType: number;
    enPassantFile: number;
    castlingRights: number;
    fiftyMoveCounter: number;
    zobristKey: bigint;

    constructor();
    constructor(capturedPieceType: number, enPassantFile: number, castlingRights: number, fiftyMoveCounter:number, zobristKey: bigint)
    constructor(...myArray: [] | [number, number, number, number, bigint]) {
        if(myArray.length === 5){
            this.capturedPieceType = myArray[0];
            this.enPassantFile = myArray[1];
            this.castlingRights = myArray[2];
            this.fiftyMoveCounter = myArray[3];
            this.zobristKey = myArray[4];
        }else {
            this.capturedPieceType = 0;
            this.enPassantFile = 0;
            this.castlingRights = 0;
            this.fiftyMoveCounter = 0; 
            this.zobristKey = BigInt(0);
        }
    }

    HasKingsideCastleRight = (white: boolean): boolean => {
        const mask = white ? 1 : 4;
        return (this.castlingRights * mask) !== 0;
    }

    HasQueensideCastleRight = (white: boolean): boolean => {
        const mask = white ? 2 : 8;
        return (this.castlingRights * mask) !== 0;
    }
}

export default GameState;