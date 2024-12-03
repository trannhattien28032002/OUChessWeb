import Coord from "src/interfaces/gamecore/board/Coord";

class PrecomputedEvaluationData {
    PawnShieldSquaresWhite: number[][];
    PawnShieldSquaresBlack: number[][];

    CreatePawnShieldSquare = (squareIndex: number) => {
        const shieldIndicesWhite = new Array<number>();
        const shieldIndicesBlack = new Array<number>();
        const coord: Coord = new Coord(squareIndex);
        const rank: number = coord.rankIndex;
        const file: number = Math.min(Math.max(coord.fileIndex, 1), 6);

        const AddIfValid = (coord: Coord, list: Array<number>) => {
            if (coord.IsValidSquare()) {
                list.push(coord.SquareIndex());
            }
        };

        for (let fileOffset = -1; fileOffset <= 1; fileOffset++) {
            AddIfValid(new Coord(file + fileOffset, rank + 1), shieldIndicesWhite);
            AddIfValid(new Coord(file + fileOffset, rank - 1), shieldIndicesBlack);
        }

        for (let fileOffset = -1; fileOffset <= 1; fileOffset++) {
            AddIfValid(new Coord(file + fileOffset, rank + 2), shieldIndicesWhite);
            AddIfValid(new Coord(file + fileOffset, rank - 2), shieldIndicesBlack);
        }
    };

    constructor() {
        this.PawnShieldSquaresBlack = new Array<number>(64).map(() => []);
        this.PawnShieldSquaresWhite = new Array<number>(64).map(() => []);

        for (let i = 0; i < 64; i++) {
            this.CreatePawnShieldSquare(i);
        }
    }
}

export default PrecomputedEvaluationData;
