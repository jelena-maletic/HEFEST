import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "./auth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const userRole = getRole();
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}