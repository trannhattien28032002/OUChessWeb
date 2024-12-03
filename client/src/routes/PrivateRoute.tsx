import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

type PrivateRouterProps = {
    component: any;
};

const PrivateRouter: React.FC<PrivateRouterProps> = ({ component: Component }) => {
    const token = Cookies.get("token");
    
    if (!token) {
        return <Navigate to={"/login"} />;
    } else {
        return <>{Component}</>;
    }
};

export default PrivateRouter;
