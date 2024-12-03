import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import Sidebar from "src/share/sidebar/Sidebar";
import Header from "src/share/header/Header";
import { socket } from "src";
import { useNavigate } from "react-router-dom";
import { userActions } from "src/redux/reducer/user/UserReducer";

interface Props {}

const Home = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    useEffect(() => {
        if (currentUser._id) {
            Cookies.set("user", JSON.stringify(currentUser), {
                expires: 30
            });
        }else{
            dispatch(userActions.reqGetCurrentUser({}));
        }
    }, [currentUser]);

    useEffect(() => {
        if(detail !== null && detail.id !== ""){
            nav(`/game/live/${detail?.id}`);
        }
    }, [detail])

    return (
        <>
            {!currentUser && <div>Loading....</div>}
            {currentUser && (
                <div style={{ width: "100%", height: "100vh", backgroundColor: "#312e2b" }}>
                    <Sidebar />
                </div>
            )}
        </>
    );
};

export default Home;
