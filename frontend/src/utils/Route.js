import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute () {
    const { accessToken } = useAuth()
    if (!accessToken){
        return <Navigate to="/login" />;
    }
    return <Outlet />
};

export function PrivateRoute () {
    const { accessToken } = useAuth()
    if (accessToken){
        return <Navigate to="/products" />;
    }
    return <Outlet />
};


