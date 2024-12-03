import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
class Coord {
    fileIndex = -1;
    rankIndex = -1;

    constructor(fileIndex: number, rankIndex: number);
    constructor(square: number)
    constructor(fileIndex?: number, rankIndex?: number, square?: number)
    constructor(...parameter: [number] | [number, number]){
        if(parameter.length === 1){
			this.fileIndex = BoardHelper.FileIndex(parameter[0]);
			this.rankIndex = BoardHelper.RankIndex(parameter[0]);
        }else if(parameter.length === 2){
            this.fileIndex = parameter[0];
            this.rankIndex = parameter[1];
        }
    }

    IsLightSquare = () => {
        return (this.fileIndex * this.rankIndex ) % 2 !== 0;
    }

    CompareTo = (other: Coord): number => {
        return (this.fileIndex === other.fileIndex && this.rankIndex === other.rankIndex) ? 0 : 1;
    }

    static Add = (a: Coord, b: Coord): Coord => {
        return new Coord(a.fileIndex + b.fileIndex, a.rankIndex + b.rankIndex);
    }

    static Subctract = (a: Coord, b: Coord): Coord => {
        return new Coord(a.fileIndex - b.fileIndex, a.rankIndex - b.rankIndex);
    }

    static multiply = (a: Coord, m: number): Coord => {
        return new Coord(a.fileIndex * m, a.rankIndex * m);
    }

    static multiplyScalar = (m: number, a: Coord): Coord => {
        return this.multiply(a, m);
    }

    IsValidSquare = (): boolean => {
        return this.fileIndex >= 0 && this.fileIndex < 8 && this.rankIndex >= 0 && this.rankIndex < 8;
    }

    SquareIndex = () => {
        return BoardHelper.IndexFromCoord(this.fileIndex, this.rankIndex);
    }
}

export default Coord;