import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ErrorMessage } from "@hookform/error-message";
import { userDataForm } from "src/redux/reducer/admin/Types";

type Props = {
    newUser: userDataForm;
    onSubmit: (data: Props["newUser"]) => void;
    closeModel: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminAddUserForm = (props: Props) => {
    const { newUser, onSubmit, closeModel } = props;

    const schema = yup.object<Props["newUser"]>().shape({
        username: yup.string().required("Vui lòng nhập tên tài khoản").optional(),
        password: yup.string().required("Vui lòng nhập mật khẩu").optional(),
        email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email").optional(),
        phone: yup.string().required("Vui lòng nhập số điện thoại").optional(),
        firstname: yup.string().optional(),
        lastName: yup.string().optional(),
        nation: yup.string().optional(),
        elo: yup.number().optional(),
        file: yup.mixed().optional(),
    });

    const form = useForm({
        defaultValues: newUser,
        resolver: yupResolver(schema),
    });

    const submitHandler = (data: Props["newUser"]) => {
        onSubmit(data);
    };

    return (
        <>
            <div className="admin-add-user-form">
                <div className="admin-user-form-title">
                    <div>Thêm tài khoản</div>
                    <div className="admin-form-close" onClick={(evt) => closeModel(false)}>
                        X
                    </div>
                </div>
                <form className="admin-user-main-form" onSubmit={form.handleSubmit(submitHandler)}>
                    <div className="admin-sub-form">
                        <div className="admin-form-control">
                            <label htmlFor="firstName">Họ và tên đệm</label>
                            <input
                                className="input-style"
                                id="firstName"
                                type="text"
                                placeholder="Họ và tên đệm"
                                {...form.register("firstName")}
                            />
                            <ErrorMessage
                                name="firstName"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>
                        <div className="admin-form-control">
                            <label htmlFor="lastName">Tên</label>
                            <input
                                className="input-style"
                                id="lastName"
                                type="text"
                                placeholder="Tên"
                                {...form.register("lastName")}
                            />
                            <ErrorMessage
                                name="lastName"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>
                    </div>
                    <div className="admin-sub-form">
                        <div className="admin-form-control">
                            <label htmlFor="email">Email</label>
                            <input
                                className="input-style"
                                id="email"
                                type="text"
                                placeholder="email"
                                {...form.register("email")}
                            />
                            <ErrorMessage
                                name="email"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>
                        <div className="admin-form-control">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                                className="input-style"
                                id="phone"
                                type="text"
                                placeholder="Số điện thoại"
                                {...form.register("phone")}
                            />
                            <ErrorMessage
                                name="phone"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>
                    </div>
                    <div className="admin-sub-form">
                        <div className="admin-form-control">
                            <label htmlFor="username">Tên tài khoản</label>
                            <input
                                className="input-style"
                                id="username"
                                type="text"
                                placeholder="Tên tài khoản"
                                disabled={newUser._id ? true : false}
                                {...form.register("username")}
                            />
                            <ErrorMessage
                                name="username"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>

                        <div className="admin-form-control">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                className="input-style"
                                id="password"
                                type="password"
                                placeholder="Mật khẩu"
                                disabled={newUser._id ? true : false}
                                {...form.register("password")}
                            />
                            <ErrorMessage
                                name="password"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>
                    </div>
                    <div className="admin-sub-form">
                        <div className="admin-form-control">
                            <label htmlFor="nation">Quốc tịch</label>
                            <input
                                className="input-style"
                                id="nation"
                                type="text"
                                placeholder="Quốc tịch"
                                {...form.register("nation")}
                            />
                            <ErrorMessage
                                name="nation"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>

                        <div className="admin-form-control">
                            <label htmlFor="elo">Elo</label>
                            <input
                                className="input-style"
                                id="elo"
                                type="number"
                                placeholder="Elo"
                                {...form.register("elo")}
                            />
                            <ErrorMessage
                                name="elo"
                                errors={form.formState.errors}
                                render={({ message }) => <div className="error-msg">{message}</div>}
                            />
                        </div>
                    </div>
                    <div className="admin-form-control">
                        <input type="file" {...form.register("file")} multiple={false} />
                    </div>

                    <div>
                        <button type="submit" className="btn-form btn-form-save">
                            {newUser._id ? "Cập nhật" : "Thêm"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminAddUserForm;
