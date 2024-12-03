import { useEffect, type FC } from "react";
import { uppercaseFirstLetter } from "src/util/UpperCaseFirstLetter";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

export const StatusBar: FC = () => {
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const gameState = useAppSelector((state: RootState) => state.roomReducer.gameState);

    return (
        <div className="status-bar">
            {detail && (
                <p>
                    Room{` `}
                    <span>{detail.id}</span>
                    {` | `}Player{` `}
                    <span>{uppercaseFirstLetter(gameState.playerColor === 0 ? "white" : "black")}</span>
                    {` | `}Turn{` `}
                    <span>{uppercaseFirstLetter(gameState.turn === 0 ? "white" : "black")}</span>
                </p>
            )}
            {!gameState.isStarted && detail && <p>Share your room name to invite another player.</p>}
        </div>
    );
};
