import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { playerListActions } from "src/redux/reducer/playersList/PlayerList";
import "src/components/players/Players.scss";

type Props = object;

const Players = (props: Props) => {
    const players = useAppSelector((state: RootState) => state.PlayerListReducer.players);
    const isLoadding = useAppSelector((state: RootState) => state.PlayerListReducer.isLoadding);
    const notify = useAppSelector((state: RootState) => state.PlayerListReducer.notify);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const [p] = useSearchParams();

    useEffect(() => {
        const kw = p.get("kw");
        if (kw)
            dispatch(playerListActions.reqGetListUser({ kw }));
    }, [p]);

    useEffect(() => {
        console.log({ players });
    }, [players]);

    useEffect(() => {
        if (notify.msg !== "") {
            switch (notify.type) {
                case "error":
                    toast.error(notify.msg);
                    break;
            }
        }
    }, [notify])

    return (
        <>
            <div className="players-main">
                <div className="players-title">Danh sách người chơi</div>
                <div className="players-list">
                    {isLoadding && <div style={{ textAlign: "center" }}>...</div>}
                    {!isLoadding && players.length === 0 ? <div style={{ textAlign: "center" }}>{p.get("kw") ? "Không có bất kì người dùng nào" : "Vui lòng nhập từ khoá"}</div> :
                        players.map((p) => {
                            return (
                                <>
                                    <div className="players-item" onClick={evt => nav(`/profile/${p.username}`)}>
                                        <div className="player-img">
                                            <img src={p.avatar} alt={p.username} />
                                        </div>
                                        <div className="player-info">
                                            <div className="player-name">{p.username} {p?.nation && `(${p.nation})`}</div>
                                            <div>{p?.firstName} {p?.lastName}</div>
                                            <div className="player-elo">elo: {p.elo}</div>
                                        </div>
                                    </div>
                                </>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default Players;
