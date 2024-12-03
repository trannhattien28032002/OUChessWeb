import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

type AdminRouterProps = {
    component: any;
};

const AdminRouter: React.FC<AdminRouterProps> = ({ component: Component }) => {
    const currentuser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const token = Cookies.get("token");
    if (!token) {
        return <Navigate to={"/login"} />;
    } else {
        if (currentuser.role === "ADMIN") {
            return <>{Component}</>
        } else {
            return <Navigate to={"/"} />
        }
    }
};

export default AdminRouter;
