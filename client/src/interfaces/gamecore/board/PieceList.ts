class PieceList {
    ocuupiedSquared: number[];
    map: number[];
    numPieces: number;

    constructor(maxPieceCount: number) {
        this.ocuupiedSquared = Array(maxPieceCount || 16);
        this.map = Array(64);
        this.numPieces = 0;
    }

    Count = (): number => {
        return this.numPieces;
    };

    AddPieceAtSquare = (square: number): void => {
        this.ocuupiedSquared[this.numPieces] = square;
        this.map[square] = this.numPieces;
        this.numPieces++;
    };

    RemovePieceAtSquare = (square: number): void => {
        const pieceIndex = this.map[square];
        this.ocuupiedSquared[pieceIndex] = this.ocuupiedSquared[this.numPieces - 1];
        this.map[this.ocuupiedSquared[pieceIndex]] = pieceIndex;
        this.numPieces--;
    };

    MovePiece = (startSquare: number, targetSquare: number): void => {
        const pieceIndex = this.map[startSquare];
        this.ocuupiedSquared[pieceIndex] = targetSquare;
        this.map[targetSquare] = pieceIndex;
    };

    Get = (index: number) => {
        return this.ocuupiedSquared[index];
    };
}

export default PieceList;
