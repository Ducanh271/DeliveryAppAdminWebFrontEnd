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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api";

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👉 bạn có thể gọi API thực tế ở đây:
        // const res = await api.get("/admin/stats");
        // setStats(res.data);

        // Dữ liệu mẫu
        setStats({
          users: 157,
          orders: 42,
          products: 23,
          revenue: 1280000,
        });

        setChartData([
          { date: "T2", revenue: 200000 },
          { date: "T3", revenue: 250000 },
          { date: "T4", revenue: 400000 },
          { date: "T5", revenue: 180000 },
          { date: "T6", revenue: 350000 },
          { date: "T7", revenue: 500000 },
          { date: "CN", revenue: 420000 },
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
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
    <Box sx={{ p: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Users"
                value={stats.users}
                color="#1976d2"
                icon={<PeopleIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Orders"
                value={stats.orders}
                color="#0288d1"
                icon={<ShoppingCartIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Products"
                value={stats.products}
                color="#2e7d32"
                icon={<Inventory2Icon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue (₫)"
                value={stats.revenue}
                color="#ed6c02"
                icon={<MonetizationOnIcon />}
              />
            </Grid>
          </Grid>

          {/* ==== Biểu đồ ==== */}
          <Box sx={{ mt: 5 }}>
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

