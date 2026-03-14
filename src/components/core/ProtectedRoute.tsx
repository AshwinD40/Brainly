import { Navigate, Outlet } from "react-router";
import { useAuth } from "@clerk/react-router";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth({
    treatPendingAsSignedOut: false,
  });

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-500">
        Loading...
      </div>
    );
  }

  return isSignedIn ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
