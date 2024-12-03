import Cookies from "js-cookie";
import LoginForm from "src/share/form/LoginForm";
import LoginScene from "src/share/scene/LoginScene";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Canvas } from "@react-three/fiber";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { authActions } from "src/redux/reducer/auth/AuthReducer";
import { userActions } from "src/redux/reducer/user/UserReducer";
import notify from "src/assets/sound/notify.mp3";
import "src/components/login/Login.scss";

const Login: React.FC = () => {
    const isLoggIn = useAppSelector((state: RootState) => state.authReducer.isLoggedIn);
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const defaultData = {
        username: "",
        password: "",
    };

    const loginHandler = (data: { username: string; password: string }) => {
        dispatch(authActions.reqGetDataLogin(data));
    };

    useEffect(() => {
        const token = Cookies.get("token");
        if(token){
            dispatch(userActions.reqGetCurrentUser({}));
            nav("/");
        }
    }, [])

    useEffect(() => {
        if (isLoggIn) {
            Cookies.set("token", token, {
                path: "/",
                expires: 30,
            });
            dispatch(userActions.reqGetCurrentUser({}));
            toast.success("Đăng nhập thành công");
            nav("/");
        }
    }, [isLoggIn, token]);

    return (
        <>
            <div className="auth__container">
                <div className="model__container">
                    <Canvas>
                        <LoginScene />
                        <ambientLight color="#fff" intensity={0.1} />
                        <mesh rotation-x={-(Math.PI / 180) * 90}>
                            <planeGeometry args={[2000, 600]} />
                            <meshLambertMaterial color={"#000"} />
                        </mesh>
                        <pointLight position={[200, 100, 500]} color="#fff" intensity={0.3} />
                    </Canvas>
                </div>
                <div className="form__container">
                    <LoginForm defaultData={defaultData} onSubmit={loginHandler} />
                </div>
            </div>
        </>
    );
};

export default Login;
