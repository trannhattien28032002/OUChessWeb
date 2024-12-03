import * as BoardHelper from "../../helper/BoardHelper";
import Coord from "../../board/Coord";
import {SetSquare, ContainsSquare} from "../bitboard/BitBoardUtility";

export const CreateAllBlockerBitboards = (movementMask: bigint): bigint[] => {
    const moveSquareIndices = [] as number[];
    for(let i = 0; i < 64;i++){
        if(((movementMask >> BigInt(i)) & BigInt(1)) === BigInt(1)){
            moveSquareIndices.push(i);
        }
    }

    const numPatterns = 1 << moveSquareIndices.length;
    const blockerBitBoards = Array<bigint>(numPatterns).fill(BigInt(0));
    for(let patternIndex = 0; patternIndex < numPatterns; patternIndex++){
        for(let bitIndex = 0; bitIndex < moveSquareIndices.length; bitIndex++){
            const bit = (patternIndex >> bitIndex) & 1;
            blockerBitBoards[patternIndex] = BigInt(blockerBitBoards[patternIndex]) | (BigInt(bit) << BigInt(moveSquareIndices[bitIndex]));
        }
    }
    return blockerBitBoards;
}

export const CreateMovementMask = (squareIndex: number, ortho: boolean): bigint => {
    let mask = BigInt(0);
    const directions = ortho ? BoardHelper.RookDirection : BoardHelper.BishopDirection;
    const startCoord = new Coord(squareIndex); 
    
    for(const dir in directions){
        const cr = directions[dir];
        for(let dst = 1; dst < 8; dst++){
            const coord = Coord.Add(startCoord, Coord.multiply(cr, dst));
            const nextCoord = Coord.Add(startCoord, Coord.multiply(cr, dst + 1));
            if(nextCoord.IsValidSquare()){
                mask = SetSquare(mask, coord.SquareIndex());
            }else{
                break;
            }
        }
    }
    return mask;
}

export const LegalMoveBitboardFromBlockers = (startSquare: number, blockerBitBoards: bigint, ortho: boolean): bigint => {
    let bitBoard = BigInt(0);

    const directions = ortho ? BoardHelper.RookDirection : BoardHelper.BishopDirection;
    const startCoord = new Coord(startSquare);

    for(const i in directions){
        const dir = directions[i];
        for(let dst = 0; dst < 8; dst++){
            const coord = Coord.Add(startCoord, Coord.multiply(dir, dst));
            if(coord.IsValidSquare()){
                bitBoard = SetSquare(bitBoard, coord.SquareIndex());
                if(ContainsSquare(blockerBitBoards, coord.SquareIndex())){
                    break;
                }
            }else{
                break;
            }
        }
    }

    return bitBoard;
}