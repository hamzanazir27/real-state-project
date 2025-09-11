import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser?._id ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivateRoute;
