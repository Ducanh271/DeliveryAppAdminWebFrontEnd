
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Orders from "./pages/Orders"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products";
import Customers from "./pages/Customers"
import Shippers from "./pages/Shippers"
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang login */}
        <Route path="/" element={<Login />} />

        {/* Các trang cần đăng nhập */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/shippers" element={<Shippers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
