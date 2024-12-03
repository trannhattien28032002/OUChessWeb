import { useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { registerActions } from "src/redux/reducer/register/Register";
import { RootState } from "src/app/store";

export type registerData = {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    nation?: string;
    confirmPassword: string;
    avatar?: string;
};

type Props = {
    registerData: registerData;
    onSubmit: (data: Props["registerData"]) => void;
};

const RegisterForm = (props: Props) => {
    const { registerData, onSubmit } = props;
    const dispatch = useAppDispatch();
    const errors = useAppSelector((state: RootState) => state.registerReducer.errors);
    const isLoading = useAppSelector((state: RootState) => state.registerReducer.isLoading);

    const schema = yup.object<Props["registerData"]>().shape({
        username: yup.string().required("Vui lòng nhập tên tài khoản"),
        password: yup.string().required("Vui lòng nhập mật khẩu"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), ""], "Mật khẩu không khớp")
            .required("Vui lòng nhập mật khẩu xác nhận"),
        email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        phone: yup
            .string()
            .length(11, "Số điện thoại chưa đủ")
            .matches(/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
        firstname: yup.string(),
        lastName: yup.string(),
        nation: yup.string(),
        avatar: yup.string(),
    });

    const form = useForm({
        defaultValues: registerData,
        resolver: yupResolver(schema),
    });

    const { submitCount } = form.formState;

    const submitHandler = async (data: Props["registerData"]) => {
        await dispatch(
            registerActions.reqCheckExist({
                fieldCheck: {
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                },
            }),
        );
    };

    useEffect(() => {
        const isErros: boolean = Object.keys(errors).length > 0;
        if (isErros) {
            if (errors.email) {
                form.setError("email", {
                    message: errors.email.message,
                });
            }
            if (errors.phone) {
                form.setError("phone", {
                    message: errors.phone.message,
                });
            }
            if (errors.username) {
                form.setError("username", {
                    message: errors.username.message,
                });
            }
        } else {
            if (submitCount > 0 && !isLoading) {
                onSubmit(form.getValues());
            }
        }
    }, [errors, isLoading]);

    return (
        <>
            <div className="container">
                <div className="main">
                    <div className="login-title">ĐĂNG KÝ</div>
                    <div className="login-container">
                        <form className="login-input" onSubmit={form.handleSubmit(submitHandler)}>
                            <div className="input__container">
                                <div className="textbox__container">
                                    <input
                                        className="textbox__style"
                                        type="email"
                                        placeholder="Email"
                                        {...form.register("email")}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        errors={form.formState.errors}
                                        render={({ message }) => <div className="error-msg">{message}</div>}
                                    />
                                </div>
                            </div>
                            <div className="input__container">
                                <div className="textbox__container">
                                    <input
                                        className="textbox__style"
                                        type="text"
                                        placeholder="Phone"
                                        {...form.register("phone")}
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        errors={form.formState.errors}
                                        render={({ message }) => <div className="error-msg">{message}</div>}
                                    />
                                </div>
                            </div>
                            <div className="input__container">
                                <div className="textbox__container">
                                    <input
                                        className="textbox__style"
                                        type="text"
                                        placeholder="Tài khoản"
                                        {...form.register("username")}
                                    />
                                    <ErrorMessage
                                        name="username"
                                        errors={form.formState.errors}
                                        render={({ message }) => <div className="error-msg">{message}</div>}
                                    />
                                </div>
                            </div>
                            <div className="input__container">
                                <div className="textbox__container">
                                    <input
                                        className="textbox__style"
                                        type="password"
                                        placeholder="Mật khẩu"
                                        {...form.register("password")}
                                    />
                                    <ErrorMessage
                                        name="password"
                                        errors={form.formState.errors}
                                        render={({ message }) => <div className="error-msg">{message}</div>}
                                    />
                                </div>
                            </div>
                            <div className="input__container">
                                <div className="textbox__container">
                                    <input
                                        className="textbox__style"
                                        type="password"
                                        placeholder="Xác nhận mật khẩu"
                                        {...form.register("confirmPassword")}
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        errors={form.formState.errors}
                                        render={({ message }) => <div className="error-msg">{message}</div>}
                                    />
                                </div>
                            </div>
                            <button disabled={isLoading} className="btn__register btn__style btn__create">
                                Đăng ký
                            </button>
                        </form>
                        <div className="register-link">
                            <Link to={"/login"} className="register-dir">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterForm;
