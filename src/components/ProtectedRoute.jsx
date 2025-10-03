
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Nếu chưa đăng nhập → quay về trang login
    return <Navigate to="/" replace />;
  }

  // Nếu có token → cho phép truy cập
  return children;
}

export default ProtectedRoute;
