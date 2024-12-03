import Board from "../../board/Board";

class RepetitionTable {
    hashes: bigint[];
    startIndices: number[];
    count: number;

    constructor() {
        this.count = 0;
        this.hashes = new Array<bigint>(256).fill(BigInt(0));
        this.startIndices = new Array<number>(this.hashes.length + 1);
    }

    Init = (board: Board) => {
        const initiaHases: bigint[] = board.RepetitionPositionHistory.reverse();
        this.count = initiaHases.length;

        for(let i = 0;i < initiaHases.length; i++){
            this.hashes[i] = initiaHases[i];
            this.startIndices[i] = 0;
        }

        this.startIndices[this.count] = 0;
    }

    Push = (hash: bigint, reset: boolean) => {
        if(this.count < this.hashes.length){
            this.hashes[this.count] = hash;
            this.startIndices[this.count + 1] = reset ? this.count : this.startIndices[this.count];
        }
        this.count++;
    }

    TryPop = () => {
        this.count = Math.max(0, this.count - 1);
    }

    Contains = (h: bigint) => {
        const s = this.startIndices[this.count];
        for(let i = s; i < this.count - 1;i++){
            if(this.hashes[i] === h){
                return true;
            }
        }
        return false;
    }
}

export default RepetitionTable;