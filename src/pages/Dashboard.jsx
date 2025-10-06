
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    shippers: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, shippersRes, ordersRes, productsRes] = await Promise.all([
          api.get("/admin/customers/num-customer"),
          api.get("/admin/shippers/num-shippers"),
          api.get("/admin/orders/num-revenue"),
          api.get("/admin/products/num-products"),
        ]);

        setStats({
          users: usersRes.data["number of customers"] || 0,
          shippers: shippersRes.data["number of shippers"] || 0,
          orders: ordersRes.data["number of order"] || 0,
          products: productsRes.data["number of products"] || 0,
          revenue: ordersRes.data["revenue"] || 0,
        });

        // 🔹 Biểu đồ giả lập (bạn có thể thay bằng API thực tế sau này)
        setChartData([
          { date: "Mon", revenue: 200000 },
          { date: "Tue", revenue: 350000 },
          { date: "Wed", revenue: 500000 },
          { date: "Thu", revenue: 280000 },
          { date: "Fri", revenue: 450000 },
          { date: "Sat", revenue: 600000 },
          { date: "Sun", revenue: 380000 },
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        transition: "0.2s",
        "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            bgcolor: color,
            color: "#fff",
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
            minWidth: 45,
            minHeight: 45,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value.toLocaleString("vi-VN")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* ==== Thống kê nhanh ==== */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Customers"
                value={stats.users}
                color="#1976d2"
                icon={<PeopleIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Shippers"
                value={stats.shippers}
                color="#6a1b9a"
                icon={<LocalShippingIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Orders"
                value={stats.orders}
                color="#0288d1"
                icon={<ShoppingCartIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Products"
                value={stats.products}
                color="#2e7d32"
                icon={<Inventory2Icon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Revenue (₫)"
                value={stats.revenue}
                color="#ed6c02"
                icon={<MonetizationOnIcon />}
              />
            </Grid>
          </Grid>

          {/* ==== Biểu đồ doanh thu ==== */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Weekly Revenue
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Dashboard;
