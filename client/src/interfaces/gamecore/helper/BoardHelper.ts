import Coord from "src/interfaces/gamecore/board/Coord";

export const RookDirection = [new Coord(-1, 0), new Coord(1, 0), new Coord(0, 1), new Coord(0, -1)];
export const BishopDirection = [new Coord(-1, 1), new Coord(1, 1), new Coord(1, -1), new Coord(-1, -1)];

export const fileNames = "abcdefgh";
export const ranknames = "12345678";

export const SquareNames = {
    a1: 0,
    b1: 1,
    c1: 2,
    d1: 3,
    e1: 4,
    f1: 5,
    g1: 6,
    h1: 7,
    a8: 56,
    b8: 57,
    c8: 58,
    d8: 59,
    e8: 60,
    f8: 61,
    g8: 62,
    h8: 63
}

export const RankIndex = (squareIndex: number): number => {
    return squareIndex >> 3;
}

export const FileIndex = (squareIndex: number): number => {
    return squareIndex & 0b000111;
}

export const IndexFromCoord = (fileIndex: number, rankIndex:number): number => {
    return rankIndex * 8 + fileIndex;
}

export const CoordFromIndex = (squareIndex: number): Coord => {
    return new Coord(FileIndex(squareIndex), RankIndex(squareIndex));
}

export const LightSquare = (fileIndex: number, rankIndex: number): boolean => {
    return (fileIndex + rankIndex) % 2 !== 0;
}

export const SquareNameFromFileAndRank = (fileIndex: number, rankIndex: number): string => {
    return fileNames[fileIndex] + "" + (rankIndex + 1);
}

export const SquareNameFromCoordinate = (Coord: Coord): string => {
    return SquareNameFromFileAndRank(Coord.fileIndex, Coord.rankIndex);
}

export const SquareNameFromIndex = (squareIndex: number): string => {
    return SquareNameFromCoordinate(CoordFromIndex(squareIndex));
}

export const SquareIndexFromName = (name: string): number => {
    const fileName = name[0];
    const rankName = name[1];
    const fileIndex = fileNames.indexOf(fileName);
    const rankIndex = ranknames.indexOf(rankName);
    return IndexFromCoord(fileIndex, rankIndex);
}

export const IsValidCoordinate = (x: number, y: number): boolean => {
    return (x >= 0) && (x < 8) && (y >= 0) && (y < 8);
}

export default function BoardHelper () {};


