import React, { useEffect } from "react";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import "src/components/login/Login.scss";
import "src/Common.scss";
import { toast } from "react-toastify";
import logo from "src/assets/images/web_neutral_rd_na@1x.png";
import { signInWithGoogle } from "src/config/FirebaseConfig";
import { authActions } from "src/redux/reducer/auth/AuthReducer";

type Props = {
    defaultData: {
        username: string;
        password: string;
    };
    onSubmit: (data: Props["defaultData"]) => void;
};

const LoginForm = (props: Props) => {
    const errorMsg = useAppSelector((state: RootState) => state.commonReducer.errorMsg);
    const { defaultData, onSubmit } = props;
    const dispatch = useAppDispatch();

    const schema = yup.object<Props["defaultData"]>().shape({
        username: yup.string().required("Vui lòng nhập tên tài khoản"),
        password: yup.string().required("Vui lòng nhập mật khẩu"),
    });

    const form = useForm({
        defaultValues: defaultData,
        resolver: yupResolver(schema),
    });

    const submitHandler = (data: Props["defaultData"]) => {
        onSubmit(data);
    };

    const googleAuthenticateHandle = async () => {
        try {
            const authData = await signInWithGoogle();
            if (authData.token !== "") {
                dispatch(
                    authActions.resGetDataLogin({
                        token: authData.token,
                        refreshToken: authData.refreshToken,
                    }),
                );
            }
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
        }
    };

    useEffect(() => {
        if (errorMsg !== "") {
            toast.error(errorMsg);
        }
    }, [errorMsg]);

    return (
        <>
            <div className="login__container border-gradient">
                <div className="login__title">ĐĂNG NHẬP</div>
                <div className="input__container w-70">
                    <form className="input__form w-100" onSubmit={form.handleSubmit(submitHandler)}>
                        <div className="textbox__container">
                            <input
                                className="textbox__style"
                                type="text"
                                placeholder="Tên đăng nhập"
                                {...form.register("username")}
                            ></input>
                            <ErrorMessage
                                name="username"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>

                        <div className="textbox__container">
                            <input
                                className="textbox__style"
                                type="password"
                                placeholder="Mật khẩu"
                                {...form.register("password")}
                            ></input>
                            <ErrorMessage
                                name="password"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>

                        <div className="login__feature">
                            <div id="remember__me">
                                <input type="checkbox" id="rememberMe" name="rememberMe" />
                                <label htmlFor="rememberMe">Lưu tài khoản</label>
                            </div>
                            <div id="forgot__password">
                                <Link to={"/forget"} className="link__style">
                                    Quên mật khẩu
                                </Link>
                            </div>
                        </div>

                        <div className="login__button">
                            <button
                                type="submit"
                                className="btn__style btn__create w-60 p-3"
                                style={{ margin: "10px auto" }}
                            >
                                ĐĂNG NHẬP
                            </button>
                        </div>
                    </form>
                    <div className="login__third__auth">
                        <div onClick={googleAuthenticateHandle} className="third__auth__google">
                            <img src={logo} alt="logo" />
                        </div>
                    </div>
                    <div className="register__link">
                        <Link to={"/register"} className="link__style">
                            {" "}
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
