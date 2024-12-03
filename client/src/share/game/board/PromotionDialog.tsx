import React, { FC } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import Board from "src/interfaces/gamecore/board/Board";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";
import { PieceType } from "src/interfaces/gamecore/board/Piece";
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import { Moving } from "src/redux/reducer/room/Types";

// export type PromotePawn = {
//     pieceType: PieceType;
//     roomId?: string | null;
// };

const PromoteDialog: FC<{
    showPromotionDialog: boolean;
    setShowPromotionDialog: (showPromotionDialog: boolean) => void;
    board?: Board;
    selected: number | null;
    targeted: number | null;
    // setBoard: React.Dispatch<React.SetStateAction<Board>>;
    // tile: Tile;
    // selected: Piece | null;
    // setSelected: (piece: Piece | null) => void;
    // lastSelected: Tile | null;
    // setLastSelected: (lastSelected: Tile | null) => void;
    // movingTo: MovingTo | null
    // setMovingTo: (movingTo: MovingTo | null) => void
    // setTurn: React.Dispatch<React.SetStateAction<Color>>
    // setMoves: (moves: Move[]) => void;
}> = ({
    showPromotionDialog,
    setShowPromotionDialog,
    board,
    selected,
    targeted,
    // setBoard,
    // tile,
    // selected,
    // setSelected,
    // lastSelected,
    // setLastSelected,
    // movingTo,
    // setMovingTo,
    // setTurn,
}) => {
    const turn = useAppSelector((state: RootState) => state.gameSettingsReducer.turn);
    const gameStarted = useAppSelector((state: RootState) => state.gameSettingsReducer.gameStarted);
    const movingTo = useAppSelector((state: RootState) => state.gameSettingsReducer.movingTo);
    // const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const roomId = useAppSelector((state: RootState) => state.roomReducer.detail?.id);
    const dispatch = useAppDispatch();

    // const handleSelectPieceType = (pieceType: PieceType) => {
    //     if (!tile || !movingTo || !socket) return;
    //     setBoard((prev) => {
    //         const newBoard = copyBoard(prev);
    //         const selectedTile = selected ? getTile(newBoard, selected.position) : null;
    //         const tileToMoveTo = getTile(newBoard, tile.position);
    //         if (tileToMoveTo && selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
    //             selectedTile.piece.type = pieceType;
    //             selectedTile.piece.id = selectedTile.piece.id + 2;
    //             tileToMoveTo.piece = selectedTile.piece ? { ...selectedTile.piece, position: tile.position } : null;
    //             selectedTile.piece = null;
    //         }

    //         return newBoard;
    //     });

    //     setShowPromotionDialog(false);
    //     dispatch(gameSettingActions.setTurn());
    //     dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
    //     setSelected(null);
    //     setLastSelected(null);

    //     const promotePawn: PromotePawn = {
    //         pieceType: pieceType,
    //         roomId: roomId,
    //     };
    //     socket.emit(`promotePawn`, promotePawn);
    // };

    const handleSelectPieceType = (promotionFlag: number) => {
        if (board) {
            if (selected !== null && targeted !== null) {
                dispatch(roomAction.requestMoving({
                    rId: roomId ? roomId : "",
                    moving: {
                        start: selected,
                        target: targeted,
                        flag: promotionFlag
                    } as Moving
                }))
            }
            setShowPromotionDialog(false);
        }
    };

    return (
        <>
            {showPromotionDialog && (
                <div className="promotion-dialog">
                    <div className="promotion-row">
                        <h3>Chọn quân cờ bạn muốn thăng cấp</h3>
                    </div>
                    <div className="promotion-row">
                        <div className="piece-buttons">
                            <button onClick={() => handleSelectPieceType(MoveFlag.PromoteToQueenFlag)}>
                                <img src="path/to/queen.png" alt="Queen" />
                                Hậu (Queen)
                            </button>
                            <button onClick={() => handleSelectPieceType(MoveFlag.PromoteToRookFlag)}>
                                <img src="path/to/rook.png" alt="Rook" />
                                Xe (Rook)
                            </button>
                            <button onClick={() => handleSelectPieceType(MoveFlag.PromoteToBishopFlag)}>
                                <img src="path/to/bishop.png" alt="Bishop" />
                                Tượng (Bishop)
                            </button>
                            <button onClick={() => handleSelectPieceType(MoveFlag.PromoteToKnightFlag)}>
                                <img src="path/to/knight.png" alt="Knight" />
                                Mã (Knight)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PromoteDialog;
