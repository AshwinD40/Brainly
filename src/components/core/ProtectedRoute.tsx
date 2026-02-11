import { Navigate, Outlet } from "react-router-dom"
import { auth } from "../../utils/auth"


const ProtectedRoute = () => {
  return auth.isAuthenticated()
    ? <Outlet />
    : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;