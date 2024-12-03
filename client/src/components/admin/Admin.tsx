import moment from "moment";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { userDataForm } from "src/redux/reducer/admin/Types";
import { adminActions } from "src/redux/reducer/admin/AdminReducer";
import AdminAddUserForm from "src/share/form/AdminAddUserForm";
import "src/components/admin/Admin.scss";
type Props = object;

const defaultUser: userDataForm = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nation: "",
    avatar: "",
    dateOfBirth: new Date(),
    elo: 500,
    friends: [],
    file: undefined,
};

const Admin = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const userList = useAppSelector((state: RootState) => state.adminReducer.userList);
    const isLoadding = useAppSelector((state: RootState) => state.adminReducer.isLoading);
    const notify = useAppSelector((state: RootState) => state.adminReducer.notify);
    const dispatch = useAppDispatch();
    const nav = useNavigate();
    const [p] = useSearchParams();
    const [kw, setKw] = useState<string>("");
    const [add, setAddActive] = useState<boolean>(false);
    const [newUser, setNewUser] = useState<userDataForm>(defaultUser);

    useEffect(() => {
        const kw = p.get("kw") || "";
        if (kw !== null) dispatch(adminActions.reqGetListUser({ kw }));
    }, [p]);

    const AddHandler = async (data: userDataForm) => {
        // console.log(data["username"]);
        console.log("adding...");
        const fd = new FormData();

        for (const d in data) {
            if (d === "file" && data[d]) {
                fd.append(d, (data[d as keyof typeof data] as any)[0]);
                continue;
            }

            fd.append(d, data[d as keyof typeof data] as any);
        }

        dispatch(adminActions.reqAddUser({ user: fd }));
    };

    const updateHandler = async (data: userDataForm) => {
        console.log("updating...");
        const fd = new FormData();
        for (const d in data) {
            if (d === "file" && data[d]) {
                fd.append(d, (data[d as keyof typeof data] as any)[0]);
                continue;
            }

            fd.append(d, data[d as keyof typeof data] as any);
        }

        dispatch(adminActions.reqUpdateUser({ user: fd }));
    };

    const submitHandler = (data: userDataForm) => {
        if (!newUser._id) {
            AddHandler(data);
        } else {
            updateHandler(data);
        }
    };

    const banPlayer = (username: string) => {
        dispatch(adminActions.reqDeletedUser({ username }));
    };

    const addModel = add ? (
        <AdminAddUserForm newUser={newUser} onSubmit={submitHandler} closeModel={setAddActive} />
    ) : (
        ""
    );

    useEffect(() => {
        switch (notify.type) {
            case "success": {
                toast.success(notify.msg);
                setAddActive(false);
                break;
            }
            case "error": {
                toast.error(notify.msg);
                break;
            }
        }
    }, [notify]);

    return (
        <>
            {addModel}
            <div className="admin-nav">
                <div className="admin-nav-title">Chess Realm Admin</div>
                <div className="admin-nav-user" onClick={(evt) => nav(`/profile/${currentUser.username}`)}>
                    <div className="admin-user-img">
                        <img src={currentUser.avatar} alt={currentUser.username} />
                    </div>
                    <div className="admin-user-username">{currentUser.username}</div>
                </div>
            </div>
            <div className="admin-content">
                <div className="content-header">
                    <div className="content-header-title">Quản lý người chơi</div>
                    <div className="content-header-fetaure">
                        <div className="feature-search">
                            <input
                                type="text"
                                placeholder="Tên tài khoản..."
                                value={kw}
                                onChange={(evt) => setKw(evt.target.value)}
                                onKeyDown={(evt) => {
                                    if (evt.key === "Enter") nav(`/admin/?kw=${kw}`);
                                }}
                            />
                        </div>
                        <div
                            className="feature-add btn-form btn-form-save"
                            onClick={(evt) => {
                                setNewUser(defaultUser);
                                setAddActive(true);
                            }}
                        >
                            Tạo
                        </div>
                    </div>
                </div>
                <div className="content-body">
                    <div style={{ overflow: "auto", height: "600px", display: "inline-block" }}>
                        <table className="table-content">
                            <thead className="table-header">
                                <tr>
                                    <th></th>
                                    <th>Tên tài khoản</th>
                                    <th>Elo</th>
                                    <th>Ngày tạo</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {!isLoadding &&
                                    userList.length !== 0 &&
                                    userList.map((u) => {
                                        if (u?.username !== currentUser.username) {
                                            return (
                                                <>
                                                    <tr className={u.deletedAt ? "banned" : "default"}>
                                                        <td className="col-avatar">
                                                            <img src={u.avatar} alt={u.username} />
                                                        </td>
                                                        <td>{u.username}</td>
                                                        <td>{u.elo}</td>
                                                        <td>{moment(u?.createdAt).format("DD-MM-YYYY")}</td>

                                                        <td>
                                                            {!u.deletedAt && (
                                                                <>
                                                                    <button
                                                                        onClick={(evt) => {
                                                                            setNewUser(u);
                                                                            setAddActive(true);
                                                                        }}
                                                                    >
                                                                        Sửa
                                                                    </button>
                                                                    <button
                                                                        onClick={(evt) => {
                                                                            if (u.username) {
                                                                                banPlayer(u.username);
                                                                            }
                                                                        }}
                                                                    >
                                                                        Vô hiệu
                                                                    </button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </>
                                            );
                                        }
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;
