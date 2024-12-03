import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";

type Props = {
    onSubmit: (data: any) => void;
};

const ChangePasswordForm = (props: Props) => {
    const { onSubmit } = props;

    const schema = yup.object().shape({
        password: yup.string().required("Vui lòng nhập mật khẩu mới"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), ""], "Mật khẩu xác nhận không trùng khớp")
            .required("Vui lòng nhập xác nhận mật khẩu"),
    });

    const form = useForm({
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        resolver: yupResolver(schema),
    });

    const submitHandle = (data: any) => {
        onSubmit(data);
        form.reset();
    };

    const { isDirty, isSubmitted, isSubmitSuccessful } = form.formState;
    console.log(isSubmitted, isSubmitSuccessful);

    return (
        <>
            <div className="information-container">
                <div className="information-title">ĐẶT LẠI MẬT KHẨU</div>
                <div className="information-content">
                    <form onSubmit={form.handleSubmit(submitHandle)} className="information-form">
                        <div className="input-form-container">
                            <label className="label-form" htmlFor="newPassword">
                                Mật khẩu
                            </label>
                            <div className="input-field">
                                <input
                                    type="password"
                                    id="password"
                                    className="input-form"
                                    {...form.register("password", {
                                        onChange: (e) => {
                                            form.setValue("password", e.target.value.trim());
                                        },
                                    })}
                                />
                                {isSubmitted && (
                                    <ErrorMessage
                                        name="password"
                                        errors={form.formState.errors}
                                        render={({ message }) => <div className="error-msg">{message}</div>}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="input-form-container">
                            <label className="label-form" htmlFor="confirmPassword">
                                Xác nhận mật khẩu
                            </label>
                            <div className="input-field">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="input-form"
                                    {...form.register("confirmPassword", {
                                        onChange: (e) => {
                                            form.setValue("confirmPassword", e.target.value.trim());
                                        },
                                    })}
                                />
                                {isSubmitted && (
                                    <ErrorMessage
                                        name="confirmPassword"
                                        errors={form.formState.errors}
                                        render={({ message }) => <div className="error-msg">{message}</div>}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="input-form-container">
                            <button disabled={!isDirty} className="btn-form btn-form-save" type="submit">
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePasswordForm;
