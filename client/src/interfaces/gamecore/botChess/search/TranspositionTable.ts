import Board from "src/interfaces/gamecore/board/Board";
import Move from "src/interfaces/gamecore/board/Move";
import Searcher, { IsMateScore } from "src/interfaces/gamecore/botChess/search/Searcher";

class TranspositionTable {
    static lookUpFailed = -1;
    static exact = 0;
    static lowerBound = 1;
    static upperBound = 2;

    entries: Entry[];

    count: bigint;

    enabled = true;

    board: Board;

    constructor(board: Board, sizeMB: number) {
        this.board = board;

        const ttEntrySizeBytes = GetSize(new Entry());
        const desiredTableSizeInBytes = sizeMB * 1024 * 1024;
        let numEntries = desiredTableSizeInBytes / ttEntrySizeBytes;
        numEntries = Number(numEntries.toFixed());

        this.count = BigInt(numEntries);
        this.entries = new Array<Entry>(numEntries).fill(new Entry());
    }

    Clear = () => {
        for (let i = 0; i < this.entries.length; i++) {
            this.entries[i] = new Entry();
        }
    };

    Index = (): bigint => {
        return BigInt(this.board.CurrentGameState.zobristKey) % BigInt(this.count);
    };

    TryGetStoredMove = (): Move => {
        return this.entries[Number(this.Index())].move;
    };

    TryLookupEvaluation = (
        depth: number,
        plyFromRoot: number,
        alpha: number,
        beta: number,
        _eval: number,
    ): { _eval: number; status: boolean } => {
        return {
            _eval: 0,
            status: false,
        };
    };

    LookupEvaluation = (depth: number, plyFromRoot: number, alpha: number, beta: number) => {
        if (!this.enabled) {
            return TranspositionTable.lookUpFailed;
        }

        const entry = this.entries[Number(this.Index())];
        if (entry.key === this.board.CurrentGameState.zobristKey) {
            // Only use stored evaluation if it has been searched to at least the same depth as would be searched now
            if (entry.depth >= depth) {
                const correctedScore = this.CorrectRetrievedMateScore(entry.value, plyFromRoot);
                // We have stored the exact evaluation for this position, so return it
                if (entry.nodeType === TranspositionTable.exact) {
                    return correctedScore;
                }
                // We have stored the upper bound of the eval for this position. If it's less than alpha then we don't need to
                // search the moves in this position as they won't interest us; otherwise we will have to search to find the exact value
                if (entry.nodeType === TranspositionTable.upperBound && correctedScore <= alpha) {
                    return correctedScore;
                }
                // We have stored the lower bound of the eval for this position. Only return if it causes a beta cut-off.
                if (entry.nodeType === TranspositionTable.lowerBound && correctedScore >= beta) {
                    return correctedScore;
                }
            }
        }
        return TranspositionTable.lookUpFailed;
    };

    StoreEvaluation = (depth: number, numPlySearched: number, _eval: number, evalType: number, move: Move) => {
        if (!this.enabled) {
            return;
        }
        const index = this.Index();

        //if (depth >= entries[Index].depth) {
        const entry = new Entry(
            this.board.CurrentGameState.zobristKey,
            this.CorrectMateScoreForStorage(_eval, numPlySearched),
            depth,
            evalType,
            move,
        );
        this.entries[Number(this.Index())] = entry;
        //}
    };

    CorrectMateScoreForStorage = (score: number, numPlySearched: number) => {
        if (IsMateScore(score)) {
            const sign = Math.sign(score);
            return (score * sign + numPlySearched) * sign;
        }
        return score;
    };

    CorrectRetrievedMateScore = (score: number, numPlySearched: number) => {
        if (IsMateScore(score)) {
            const sign = Math.sign(score);
            return (score * sign - numPlySearched) * sign;
        }
        return score;
    };

    GetEntry = (zobristKey: bigint): Entry => {
        return this.entries[Number(zobristKey % BigInt(this.entries.length))];
    };
}

class Entry {
    key: bigint;
    value: number;
    move: Move;
    depth: number;
    nodeType: number;

    constructor();
    constructor(key: bigint, value: number, depth: number, nodeType: number, move: Move);
    constructor(...args: [] | [bigint, number, number, number, Move]) {
        if (args.length === 5) {
            this.key = args[0];
            this.value = args[1];
            this.move = args[4];
            this.depth = args[2];
            this.nodeType = args[3];
        } else {
            this.key = BigInt(-1);
            this.value = -1;
            this.move = new Move(-1);
            this.depth = -1;
            this.nodeType = -1;
        }
    }
}

export const GetSize = (instace: Entry) => {
    const objectList: any[] = [];
    const stack: any[] = [instace];
    let bytes = 0;

    while (stack.length) {
        const value = stack.pop();

        if (typeof value === "boolean") {
            bytes += 4; // Assuming 4 bytes for a boolean
        } else if (typeof value === "string") {
            bytes += value.length * 2; // Assuming each character is 2 bytes (UTF-16)
        } else if (typeof value === "number") {
            bytes += 8; // Assuming 8 bytes for a number
        } else if (typeof value === "bigint") {
            bytes += 8
        } else if (typeof value === "object" && !objectList.includes(value)) {
            objectList.push(value);
            for (const prop in value) {
                stack.push(value[prop]);
            }
        }
    }

    return bytes;
};

export default TranspositionTable;
