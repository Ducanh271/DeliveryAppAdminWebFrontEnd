
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People"
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // icon cho shipper
import api from "../api";

const drawerWidth = 240;

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Xóa token
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      // Quay lại trang login
      navigate("/login");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      {/* Thanh AppBar trên cùng */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          bgcolor: "#1976d2",
          color: "white",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>

          {/* Nút Logout */}
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.15)",
              },
            }}
          >
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#ffffff",
          },
        }}
      >
        <Toolbar /> {/* chừa chỗ cho AppBar */}
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                  <DashboardIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/products">
                <ListItemIcon>
                  <InventoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/orders">
                <ListItemIcon>
                  <LocalShippingIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/customers">
                <ListItemIcon>
                  <PeopleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component={Link} to="/shippers">
                <ListItemIcon>
                  <PeopleAltIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Shippers" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f5f6fa",
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Chừa khoảng cho AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardLayout;
