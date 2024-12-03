import React, { useEffect, useState } from "react";
import * as yup from "yup";
import moment from "moment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { userState } from "src/redux/reducer/user/Types";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";


type Props = {
    profile: userState["currentUser"];
    isLoading: boolean | undefined;
    onSubmit: (value: any) => void;
};

const ProfileForm = (props: Props) => {
    const { profile, isLoading, onSubmit } = props;
    const errorMsg = useAppSelector((state: RootState) => state.commonReducer.errorMsg);

    const schema = yup.object<Props["profile"]>().shape({
        _id: yup.string().required(),
        username: yup.string().required(),
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        phone: yup
            .string()
            .length(11, "Số điện thoại chưa đủ")
            .matches(/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/im, "Số điện thoại không hợp lệ")
            .required("Vui lòng nhập số điện thoại"),
        dateOfBirth: yup
            .date()
            .typeError("Ngày sinh không hợp lệ")
            .required("Vui lòng nhập ngày sinh")
            .max(new Date())
            .nonNullable(),
        email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        elo: yup.number().required(),
        nation: yup.string().required(),
        avatar: yup.string().nullable().required(),
        role: yup.string().optional()
    });

    const form = useForm<Props["profile"]>({
        defaultValues: profile,
        resolver: yupResolver(schema),
    });

    const { isDirty, isValid } = form.formState;
    const [initialDate, setInitialDate] = useState<string>();

    useEffect(() => {
        const subscription = form.watch((value: any, { name, type }) => {
            if (name === "dateOfBirth" && type === "change") setInitialDate(moment(value[name]).format("yyyy-MM-DD"));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [form.watch]);

    const submitHandle = (data: any) => {
        onSubmit(data);
    };

    useEffect(() => {
        setInitialDate(moment(profile.dateOfBirth).format("yyyy-MM-DD"));
    }, []);

    return (
        <>
            <div className="information-container">
                <div className="information-title">THÔNG TIN NGƯỜI DÙNG</div>
                <div className="information-content">
                    {/* {errorMsg && (
                        <div
                            style={{
                                width: "50%",
                                margin: "5px auto",
                                padding: "10px",
                                backgroundColor: "red",
                                textAlign: "center",
                            }}
                        >
                            {errorMsg}
                        </div>
                    )} */}
                    <form onSubmit={form.handleSubmit(submitHandle)} className="information-form">
                        <div className="input-form-container">
                            <label className="label-form" htmlFor="firstName">
                                Họ và tên đệm
                            </label>
                            <div className="input-field">
                                <input
                                    type="text"
                                    id="firstName"
                                    className="input-form"
                                    {...form.register("firstName")}
                                />

                                <ErrorMessage
                                    name="firstName"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                        </div>
                        <div className="input-form-container">
                            <label className="label-form" htmlFor="lastName">
                                Tên
                            </label>
                            <div className="input-field">
                                <input
                                    type="text"
                                    id="lastName"
                                    className="input-form"
                                    {...form.register("lastName")}
                                />
                                <ErrorMessage
                                    name="lastName"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                        </div>
                        <div className="input-form-container">
                            <label className="label-form" htmlFor="email">
                                Email
                            </label>
                            <div className="input-field">
                                <input type="text" id="email" className="input-form" {...form.register("email")} />

                                <ErrorMessage
                                    name="email"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                        </div>
                        <div className="input-form-container">
                            <label className="label-form" htmlFor="phone">
                                Số điện thoại
                            </label>
                            <div className="input-field">
                                <input type="text" id="phone" className="input-form" {...form.register("phone")} />
                                <ErrorMessage
                                    name="phone"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                        </div>

                        <div className="input-form-container">
                            <label className="label-form" htmlFor="dOb">
                                Ngày sinh
                            </label>
                            <div className="input-field">
                                <input
                                    type="date"
                                    id="dOb"
                                    className="input-form"
                                    value={initialDate}
                                    {...form.register("dateOfBirth")}
                                />
                                <ErrorMessage
                                    name="dateOfBirth"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                        </div>
                        <div className="input-form-container">
                            <label className="label-form" htmlFor="nation">
                                Quốc tịch
                            </label>
                            <div className="input-field">
                                <input {...form.register("nation")} type="text" id="nation" className="input-form" />

                                <ErrorMessage
                                    name="nation"
                                    errors={form.formState.errors}
                                    render={({ message }) => <div className="error-msg">{message}</div>}
                                />
                            </div>
                        </div>

                        <div className="input-form-container">
                            {!isLoading ? (
                                <button
                                    disabled={!isDirty || !isValid}
                                    className="btn-form btn-form-save"
                                    type="submit"
                                >
                                    Lưu
                                </button>
                            ) : (
                                <button disabled={isLoading} className="btn-form btn-form-save" type="submit">
                                    ...
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfileForm;
